import os
import requests
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from requests.exceptions import RequestException, Timeout, ConnectionError
from utils.json_helper import deserialize_json_to_object
from utils.logger import log_api_error
from config import read_from_config_files
from constants import (RETRY_MAX_ATTEMPTS, RETRY_WAIT_MULTIPLIER, RETRY_WAIT_MIN, RETRY_WAIT_MAX)


def _default_session():
    """Lazy-load Okta session from Playwright auth file when available."""
    try:
        from utils.okta_brand import get_authenticated_session
        return get_authenticated_session()
    except FileNotFoundError:
        return None

def _csrf_from_session(session):
        for name in ("csrftoken", "csrf", "csrf_token"):
            v = session.cookies.get(name)
            if v:
                return v
        return None

class BaseClient:

    def __init__(self, session=None):
        """
        :param session: Optional requests.Session (e.g. with Okta cookies from Playwright auth).
                        If None, attempts to load session from Playwright auth file (see utils/okta_auth.py).
        """
        self._session = session if session is not None else _default_session()
        self.base_url = self._resolve_base_url()

    def _resolve_base_url(self) -> str:
        """
        Resolve base_url with priority:
          1) BASE_URL env var
          2) urls.ini config
        """
        
        env_url = os.getenv("BASE_URL")
        if env_url:
            return env_url.rstrip("/")

        config = read_from_config_files()
        base_url = config.get("base_url") or config.get("BASE_URL")

        base = base_url.rstrip("/")
        if base.startswith("http://"):
            base = "https://" + base[len("http://"):]
        elif not base.startswith(("http://", "https://")):
            base = "https://" + base
        return base


    def _http(self):
        return self._session if self._session is not None else requests

    @retry(
        stop=stop_after_attempt(RETRY_MAX_ATTEMPTS),
        wait=wait_exponential(multiplier=RETRY_WAIT_MULTIPLIER, min=RETRY_WAIT_MIN, max=RETRY_WAIT_MAX),
        retry=retry_if_exception_type((RequestException, Timeout, ConnectionError)),
        reraise=True
    )
    def get_request(self, url, auth_token=None, status_code=None, params=None, *args):
        session = self._http()
        csrf = _csrf_from_session(session)
        get_url = self.base_url + url
        if args:
            get_url = get_url.format(*args)
        headers = {"Content-Type": "application/json", "Accept": "application/json"}
        if auth_token is not None:
            headers['Authorization'] = 'Token ' + auth_token
        if csrf:
            headers["X-CSRFToken"] = csrf
            headers["Referer"] = self.base_url.rstrip("/") + "/"
        get_response = session.get(get_url, headers=headers, params=params, verify=False)
        print("RESPONSE STATUS CODE:", get_response.status_code)
        if status_code is not None:
            assert get_response.status_code == status_code
        return get_response.text

    @retry(
        stop=stop_after_attempt(RETRY_MAX_ATTEMPTS),
        wait=wait_exponential(multiplier=RETRY_WAIT_MULTIPLIER, min=RETRY_WAIT_MIN, max=RETRY_WAIT_MAX),
        retry=retry_if_exception_type((RequestException, Timeout, ConnectionError)),
        reraise=True
    )
    def post_request(self, url, body, auth_token=None, status_code=None, params=None, *args):
        session = self._http()
        csrf = _csrf_from_session(session)
        post_url = self.base_url + url
        for i in range(len(args)-1, -1, -1):
            post_url = post_url.replace(f'${i}', str(args[i]))
        headers = {"Content-Type": "application/json", "Accept": "application/json"}
        if auth_token is not None:
            headers['Authorization'] = 'Token ' + auth_token
        if csrf:
            headers["X-CSRFToken"] = csrf
            headers["Referer"] = self.base_url.rstrip("/") + "/"
        post_response = session.post(post_url, json=body, headers=headers, params=params, verify=False)
        print("RESPONSE STATUS CODE:", post_response.status_code)
        if status_code is not None:
            assert post_response.status_code == status_code
        return post_response.text

    @retry(
        stop=stop_after_attempt(RETRY_MAX_ATTEMPTS),
        wait=wait_exponential(multiplier=RETRY_WAIT_MULTIPLIER, min=RETRY_WAIT_MIN, max=RETRY_WAIT_MAX),
        retry=retry_if_exception_type((RequestException, Timeout, ConnectionError)),
        reraise=True
    )
    def put_request_with_query_params(self, url, request, *args):
        put_url = self.base_url + url
        for i in range(len(args)-1, -1, -1):
            put_url = put_url.replace(f'${i}', str(args[i]))
        put_response = requests.put(put_url, request, headers=self.headers)
        if not put_response.ok:
            log_api_error(put_url, request, put_response)
        return deserialize_json_to_object(put_response.text)

    @retry(
        stop=stop_after_attempt(RETRY_MAX_ATTEMPTS),
        wait=wait_exponential(multiplier=RETRY_WAIT_MULTIPLIER, min=RETRY_WAIT_MIN, max=RETRY_WAIT_MAX),
        retry=retry_if_exception_type((RequestException, Timeout, ConnectionError)),
        reraise=True
    )
    def delete_request_with_query_params(self, url, *args):
        delete_url = self.base_url + url
        for i in range(len(args)-1, -1, -1):
            delete_url = delete_url.replace(f'${i}', str(args[i]))
        delete_response = requests.delete(delete_url, headers=self.headers)
        if not delete_response.ok:
            log_api_error(delete_url, None, delete_response)
        return deserialize_json_to_object(delete_response.text)
