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
class TestLetteredVoyage_OR:

    @pytest.mark.xray_test_case("RST-2156")
    @pytest.mark.Regression
    def test_lettered_voyage(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['lettered_voyage'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow':'25'}))

    @pytest.mark.xray_test_case("RST-2157")
    @pytest.mark.Regression
    def test_lettered_voyage_blank_page(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['lettered_voyage'], json.loads(json_payload), None, 500, { 'page': '' , 'page_size': '25' , 'startRow': '0', 'endRow':'25'}))

    @pytest.mark.xray_test_case("RST-2158")
    @pytest.mark.Regression
    def test_lettered_voyage_invalid_page(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['lettered_voyage'], json.loads(json_payload), None, 500, { 'page': 'abc' , 'page_size': '25' , 'startRow': '0', 'endRow':'25'}))
    
    @pytest.mark.xray_test_case("RST-2159")
    @pytest.mark.Regression
    def test_lettered_voyage_blank_page_size(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['lettered_voyage'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '' , 'startRow': '0', 'endRow':'25'}))

    @pytest.mark.xray_test_case("RST-2160")
    @pytest.mark.Regression
    def test_lettered_voyage_invalid_page_size(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['lettered_voyage'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': 'abc' , 'startRow': '0', 'endRow':'25'}))

    @pytest.mark.xray_test_case("RST-2161")
    @pytest.mark.Regression
    def test_lettered_voyage_blank_startRow(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['lettered_voyage'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '', 'endRow':'25'}))

    @pytest.mark.xray_test_case("RST-2162")
    @pytest.mark.Regression
    def test_lettered_voyage_invalid_startRow(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['lettered_voyage'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': 'abc', 'endRow':'25'}))
    
    @pytest.mark.xray_test_case("RST-2163")
    @pytest.mark.Regression
    def test_lettered_voyage_blank_endRow(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['lettered_voyage'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow':''}))

    @pytest.mark.xray_test_case("RST-2164")
    @pytest.mark.Regression
    def test_lettered_voyage_invalid_endRow(self):
        json_payload= json.dumps({"filters":{},"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['lettered_voyage'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow':'abc'}))
