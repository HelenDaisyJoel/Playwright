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
class TestVoyageDeepDive:

    @pytest.mark.xray_test_case("RST-2138")
    @pytest.mark.Regression
    def test_vdd_voyage_info_correct_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_info'], None, 200, None, get_voyage_code))
        


    @pytest.mark.xray_test_case("RST-2139")
    @pytest.mark.Regression
    def test_vdd_voyage_info_blank_value(self):
        response = BaseClient().get_request(url_config['vdd_info'], None, 404, None, '')
        


    @pytest.mark.xray_test_case("RST-2140")
    @pytest.mark.Regression
    def test_vdd_voyage_info_incorrect_value(self):
        response = BaseClient().get_request(url_config['vdd_info'], None, 500, None, 'abc')
        


    @pytest.mark.xray_test_case("RST-2141")
    @pytest.mark.Regression
    def test_vdd_voyage_navigation_correct_value(self, get_voyage_code):
        assert get_voyage_code is not None
        json_payload= json.dumps({"filters":{},"sortModel":[]})
        response = deserialize_json_to_object(BaseClient().post_request(url_config['vdd_navigation'], json.loads(json_payload), None, 200, {'direction':'previous', 'current_voyage_code': get_voyage_code}, None))
        


    @pytest.mark.xray_test_case("RST-2142")
    @pytest.mark.Regression
    def test_vdd_voyage_navigation_blank_value(self):
        json_payload= json.dumps({"filters":{},"sortModel":[]})
        response = deserialize_json_to_object(BaseClient().post_request(url_config['vdd_navigation'], json.loads(json_payload), None, 400, {'direction':'previous', 'current_voyage_code': ''}, None))
        assert response.details.current_voyage_code[0] == 'This field may not be null.'


    @pytest.mark.xray_test_case("RST-2143")
    @pytest.mark.Regression
    def test_vdd_voyage_navigation_incorrect_value(self):
        json_payload= json.dumps({"filters":{},"sortModel":[]})
        response = deserialize_json_to_object(BaseClient().post_request(url_config['vdd_navigation'], json.loads(json_payload), None, 400, {'direction':'previous', 'current_voyage_code': 'abc'}, None))
        assert response.details.current_voyage_code[0] == 'Object with voyage_code=abc does not exist.'


    @pytest.mark.xray_test_case("RST-2144")
    @pytest.mark.Regression
    def test_vdd_voyage_key_metrics_correct_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_key_metrics'], None, 200, None, get_voyage_code))
        


    @pytest.mark.xray_test_case("RST-2145")
    @pytest.mark.Regression
    def test_vdd_voyage_key_metrics_blank_value(self):
        response = BaseClient().get_request(url_config['vdd_key_metrics'], None, 404, None, '')
        


    @pytest.mark.xray_test_case("RST-2146")
    @pytest.mark.Regression
    def test_vdd_voyage_key_metrics_incorrect_value(self):
        response = BaseClient().get_request(url_config['vdd_key_metrics'], None, 200, None, 'abc')
        


    @pytest.mark.xray_test_case("RST-2147")
    @pytest.mark.Regression
    def test_vdd_voyage_inv_correct_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_inventory'], None, 200, None, get_voyage_code))
        


    @pytest.mark.xray_test_case("RST-2148")
    @pytest.mark.Regression
    def test_vdd_voyage_inv_blank_value(self):
        response = BaseClient().get_request(url_config['vdd_inventory'], None, 404, None, '')
        


    @pytest.mark.xray_test_case("RST-2149")
    @pytest.mark.Regression
    def test_vdd_voyage_inv_incorrect_value(self):
        response = BaseClient().get_request(url_config['vdd_inventory'], None, 200, None, 'abc')


    @pytest.mark.xray_test_case("RST-2150")
    @pytest.mark.Regression
    def test_vdd_voyage_inv_meta_correct_value(self, get_voyage_code,get_meta_code):
        assert get_voyage_code is not None
        assert get_meta_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_inventory_meta'], None, 200, None, get_voyage_code,get_meta_code))
        


    @pytest.mark.xray_test_case("RST-2151")
    @pytest.mark.Regression
    def test_vdd_voyage_inv_meta_blank_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = BaseClient().get_request(url_config['vdd_inventory_meta'], None, 200, None, get_voyage_code,'')
        


    @pytest.mark.xray_test_case("RST-2152")
    @pytest.mark.Regression
    def test_vdd_voyage_inv_meta_incorrect_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = BaseClient().get_request(url_config['vdd_inventory_meta'], None, 200, None, get_voyage_code,'abc')
        


    @pytest.mark.xray_test_case("RST-2153")
    @pytest.mark.Regression
    def test_vdd_voyage_cabin_chart_correct_value(self, get_voyage_code,get_meta_code):
        assert get_voyage_code is not None
        assert get_meta_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_cabin_charts'], None, 200, None, get_voyage_code,get_meta_code))


    @pytest.mark.xray_test_case("RST-2154")
    @pytest.mark.Regression
    def test_vdd_voyage_cabin_chart_blank_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = BaseClient().get_request(url_config['vdd_cabin_charts'], None, 404, None, get_voyage_code,'')


    @pytest.mark.xray_test_case("RST-2155")
    @pytest.mark.Regression
    def test_vdd_voyage_cabin_chart_incorrect_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = BaseClient().get_request(url_config['vdd_cabin_charts'], None, 400, None, get_voyage_code,'abc')
