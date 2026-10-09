import json
import pytest
from data.clients.base_client import BaseClient
from config import read_from_config_files
from utils.json_helper import deserialize_json_to_object

url_config = read_from_config_files('urls.ini', 'ncl_urls')

@pytest.mark.REGENT_admin
@pytest.mark.REGENT_manager
@pytest.mark.OCEANIA_admin
@pytest.mark.OCEANIA_manager
@pytest.mark.NCL_admin
@pytest.mark.NCL_manager
class TestUsagePage:

    @pytest.mark.xray_test_case("RST-2275")
    @pytest.mark.Regression
    def test_usage(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['usage_list'], None, 200, None, None))


    @pytest.mark.xray_test_case("RST-2276")
    @pytest.mark.Regression
    def test_usage_summary(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['usage_summary'], None, 200, {'start_date': '2026-01-23', 'end_date':'2027-01-23'}, None))


    @pytest.mark.xray_test_case("RST-2277")
    @pytest.mark.Regression
    def test_usage_summary_blank_startDate(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['usage_summary'], None, 400, {'start_date': '', 'end_date':'2027-01-23'}, None))

    @pytest.mark.xray_test_case("RST-2278")
    @pytest.mark.Regression
    def test_usage_summary_invalid_startDate(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['usage_summary'], None, 400, {'start_date': '33/33/2027', 'end_date':'2027-01-23'}, None))

    @pytest.mark.xray_test_case("RST-2279")
    @pytest.mark.Regression
    def test_usage_summary_blank_endDate(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['usage_summary'], None, 400, {'start_date': '2026-01-23', 'end_date':''}, None))

    @pytest.mark.xray_test_case("RST-2280")
    @pytest.mark.Regression
    def test_usage_summary_invalid_endDate(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['usage_summary'], None, 400, {'start_date': '2026-01-23', 'end_date':'33/33/2027'}, None))

    @pytest.mark.xray_test_case("RST-2281")
    @pytest.mark.Regression
    def test_usage_override_logs_pricing(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'25', 'start_date': '2026-01-23', 'end_date':'2027-01-23', 'override_category':'pricing'}))

    @pytest.mark.xray_test_case("RST-2282")
    @pytest.mark.Regression
    def test_usage_override_logs_inventory(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'25', 'start_date': '2026-01-23', 'end_date':'2027-01-23', 'override_category':'inventory'}))

    @pytest.mark.xray_test_case("RST-2283")
    @pytest.mark.Regression
    def test_usage_override_logs_blank_category(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'25', 'start_date': '2026-01-23', 'end_date':'2027-01-23', 'override_category':''}))

    @pytest.mark.xray_test_case("RST-2284")
    @pytest.mark.Regression
    def test_usage_override_logs_invalid_category(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'25', 'start_date': '2026-01-23', 'end_date':'2027-01-23', 'override_category':'abc'}))

    @pytest.mark.xray_test_case("RST-2285")
    @pytest.mark.Regression
    def test_usage_override_logs_pricing_blank_page(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 500, {'page':'', 'page_size':'25', 'start_date': '2026-01-23', 'end_date':'2027-01-23', 'override_category':'pricing'}))

    @pytest.mark.xray_test_case("RST-2286")
    @pytest.mark.Regression
    def test_usage_override_logs_inventory_blank_page(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 500, {'page':'', 'page_size':'25', 'start_date': '2026-01-23', 'end_date':'2027-01-23', 'override_category':'inventory'}))
    
    @pytest.mark.xray_test_case("RST-2287")
    @pytest.mark.Regression
    def test_usage_override_logs_pricing_invalid_page(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 500, {'page':'abc', 'page_size':'25', 'start_date': '2026-01-23', 'end_date':'2027-01-23', 'override_category':'pricing'}))

    @pytest.mark.xray_test_case("RST-2288")
    @pytest.mark.Regression
    def test_usage_override_logs_inventory_invalid_page(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 500, {'page':'abc', 'page_size':'25', 'start_date': '2026-01-23', 'end_date':'2027-01-23', 'override_category':'inventory'}))

    @pytest.mark.xray_test_case("RST-2289")
    @pytest.mark.Regression
    def test_usage_override_logs_pricing_blank_page_size(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'', 'start_date': '2026-01-23', 'end_date':'2027-01-23', 'override_category':'pricing'}))

    @pytest.mark.xray_test_case("RST-2290")
    @pytest.mark.Regression
    def test_usage_override_logs_inventory_blank_page_size(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'', 'start_date': '2026-01-23', 'end_date':'2027-01-23', 'override_category':'inventory'}))
    
    @pytest.mark.xray_test_case("RST-2291")
    @pytest.mark.Regression
    def test_usage_override_logs_pricing_invalid_page_size(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'abc', 'start_date': '2026-01-23', 'end_date':'2027-01-23', 'override_category':'pricing'}))

    @pytest.mark.xray_test_case("RST-2292")
    @pytest.mark.Regression
    def test_usage_override_logs_inventory_invalid_page_size(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'abc', 'start_date': '2026-01-23', 'end_date':'2027-01-23', 'override_category':'inventory'}))

    @pytest.mark.xray_test_case("RST-2293")
    @pytest.mark.Regression
    def test_usage_override_logs_pricing_blank_startDate(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'25', 'start_date': '', 'end_date':'2027-01-23', 'override_category':'pricing'}))

    @pytest.mark.xray_test_case("RST-2294")
    @pytest.mark.Regression
    def test_usage_override_logs_inventory_blank_startDate(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'25', 'start_date': '', 'end_date':'2027-01-23', 'override_category':'inventory'}))
    
    @pytest.mark.xray_test_case("RST-2295")
    @pytest.mark.Regression
    def test_usage_override_logs_pricing_invalid_startDate(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'25', 'start_date': '33/33/2026', 'end_date':'2027-01-23', 'override_category':'pricing'}))

    @pytest.mark.xray_test_case("RST-2296")
    @pytest.mark.Regression
    def test_usage_override_logs_inventory_invalid_startDate(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'25', 'start_date': '33/33/2026', 'end_date':'2027-01-23', 'override_category':'inventory'})) 

    @pytest.mark.xray_test_case("RST-2297")
    @pytest.mark.Regression
    def test_usage_override_logs_pricing_blank_endDate(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'25', 'start_date': '2026-01-23', 'end_date':'', 'override_category':'pricing'}))

    @pytest.mark.xray_test_case("RST-2298")
    @pytest.mark.Regression
    def test_usage_override_logs_inventory_blank_endDate(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'25', 'start_date': '2026-01-23', 'end_date':'', 'override_category':'inventory'}))
    
    @pytest.mark.xray_test_case("RST-2299")
    @pytest.mark.Regression
    def test_usage_override_logs_pricing_invalid_endDate(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'25', 'start_date': '2026-01-23', 'end_date':'33/33/2026', 'override_category':'pricing'}))

    @pytest.mark.xray_test_case("RST-2300")
    @pytest.mark.Regression
    def test_usage_override_logs_inventory_invalid_endDate(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['usage_override_logs'], json.loads(json_payload), None, 200, {'page':'1', 'page_size':'25', 'start_date': '2026-01-23', 'end_date':'33/33/2026', 'override_category':'inventory'})) 
        