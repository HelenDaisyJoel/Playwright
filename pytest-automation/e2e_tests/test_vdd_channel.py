import json
import pytest
from data.clients.base_client import BaseClient
from config import read_from_config_files
from utils.json_helper import deserialize_json_to_object

url_config = read_from_config_files('urls.ini', 'ncl_urls')

@pytest.mark.REGENT_admin
@pytest.mark.REGENT_manager
@pytest.mark.REGENT_analyst
@pytest.mark.OCEANIA_admin
@pytest.mark.OCEANIA_manager
@pytest.mark.OCEANIA_analyst
@pytest.mark.NCL_admin
@pytest.mark.NCL_manager
@pytest.mark.NCL_analyst
class TestVDDChannel:

    @pytest.mark.xray_test_case("RST-2211")
    @pytest.mark.Regression
    def test_vdd_voyage_channel_correct_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_channel'], None, 200, {'voyage_code':get_voyage_code}, None))


    @pytest.mark.xray_test_case("RST-2212")
    @pytest.mark.Regression
    def test_vdd_voyage_channel_blank_value(self):
        response = BaseClient().get_request(url_config['vdd_channel'], None, 200, {'voyage_code':''}, None)


    @pytest.mark.xray_test_case("RST-2213")
    @pytest.mark.Regression
    def test_vdd_voyage_channel_incorrect_value(self):
        response = BaseClient().get_request(url_config['vdd_channel'], None, 200, {'voyage_code':'abc'}, None)


    @pytest.mark.xray_test_case("RST-2214")
    @pytest.mark.Regression
    def test_vdd_voyage_channel_with_time_correct_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_channel'], None, 200, {'voyage_code':get_voyage_code, 'start_date':'2025-08-24', 'end_date':'2025-09-07'}, None))


    @pytest.mark.xray_test_case("RST-2215")
    @pytest.mark.Regression
    def test_vdd_voyage_channel_with_time_blank_value(self):
        response = BaseClient().get_request(url_config['vdd_channel'], None, 200, {'voyage_code':'', 'start_date':'2025-08-24', 'end_date':'2025-09-07'}, None)


    @pytest.mark.xray_test_case("RST-2216")
    @pytest.mark.Regression
    def test_vdd_voyage_channel_with_time_incorrect_value(self):
        response = BaseClient().get_request(url_config['vdd_channel'], None, 200, {'voyage_code':'abc', 'start_date':'2025-08-24', 'end_date':'2025-09-07'}, None)
