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
class TestVDDGroup:

    @pytest.mark.xray_test_case("RST-2217")
    @pytest.mark.Regression
    def test_vdd_voyage_group_correct_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_group'], None, 200, None, get_voyage_code))


    @pytest.mark.xray_test_case("RST-2218")
    @pytest.mark.Regression
    def test_vdd_voyage_group_blank_value(self):
        response = BaseClient().get_request(url_config['vdd_group'], None, 404, None, '')


    @pytest.mark.xray_test_case("RST-2219")
    @pytest.mark.Regression
    def test_vdd_voyage_group_incorrect_value(self):
        response = BaseClient().get_request(url_config['vdd_group'], None, 200, None, 'abc')


    @pytest.mark.xray_test_case("RST-2220")
    @pytest.mark.Regression
    def test_vdd_voyage_group_meta_correct_value(self, get_voyage_code, get_meta_name):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_group'], None, 200, None, get_voyage_code,get_meta_name))


    @pytest.mark.xray_test_case("RST-2221")
    @pytest.mark.Regression
    def test_vdd_voyage_group_meta_blank_value(self, get_meta_name):
        response = BaseClient().get_request(url_config['vdd_group'], None, 404, None, '', get_meta_name)


    @pytest.mark.xray_test_case("RST-2222")
    @pytest.mark.Regression
    def test_vdd_voyage_group_meta_incorrect_value(self, get_meta_name):
        response = BaseClient().get_request(url_config['vdd_group'], None, 200, None, 'abc', get_meta_name)