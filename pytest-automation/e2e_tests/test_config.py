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
class TestConfigPage_OR:

    @pytest.mark.xray_test_case("RST-2223")
    @pytest.mark.Regression
    def test_config_currencies(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_currencies'], None, 200, None, None))

    @pytest.mark.xray_test_case("RST-2224")
    @pytest.mark.Regression
    def test_config_meta_categories(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_meta_categories'], None, 200, None, None))

    @pytest.mark.xray_test_case("RST-2225")
    @pytest.mark.Regression
    def test_config_brands(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_brands'], None, 200, None, None))        

    @pytest.mark.xray_test_case("RST-2226")
    @pytest.mark.Regression
    def test_config_all_ships(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_all_ships'], None, 200, None, None))            

    @pytest.mark.xray_test_case("RST-2227")
    @pytest.mark.Regression
    def test_config_current_exchange(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_current_exchange'], None, 200, None, None))

    @pytest.mark.xray_test_case("RST-2228")
    @pytest.mark.Regression
    def test_config_current_exchange_override(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_current_exchange_override'], None, 200, None, None))                    

    @pytest.mark.xray_test_case("RST-2237")
    @pytest.mark.Regression
    def test_config_commission(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_commission'], None, 200, None, None))    
    
    @pytest.mark.xray_test_case("RST-2229")
    @pytest.mark.Regression
    def test_config_psuedo_discount(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_psuedo_discount'], None, 200, None, None))    

    @pytest.mark.xray_test_case("RST-2230")
    @pytest.mark.Regression
    def test_config_rounding_rule(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_rounding_rule'], None, 200, None, None))            

    @pytest.mark.xray_test_case("RST-2231")
    @pytest.mark.Regression
    def test_config_currency_conversion(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_currency_conversion'], None, 200, None, None))          

    @pytest.mark.xray_test_case("RST-2232")
    @pytest.mark.Regression
    def test_config_currency_sailing_freeze(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_currency_sailing_freeze'], None, 200, None, None))          

    @pytest.mark.xray_test_case("RST-2233")
    @pytest.mark.Regression
    def test_config_cabin_category_ladder(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_cabin_category_ladder'], None, 200, None, None))          
    
    @pytest.mark.xray_test_case("RST-2234")
    @pytest.mark.Regression
    def test_config_t3_4_pricing(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_t3_4_pricing'], None, 200, None, None))          

    @pytest.mark.xray_test_case("RST-2235")
    @pytest.mark.Regression
    def test_config_schedule_price_sailing(self):
        json_payload= json.dumps({"advancedFilter":'null',"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['config_schedule_price_sailing'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' }))

    @pytest.mark.xray_test_case("RST-2238")
    @pytest.mark.Regression
    def test_config_schedule_price_sailing_blank_page(self):
        json_payload= json.dumps({"advancedFilter":'null',"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['config_schedule_price_sailing'], json.loads(json_payload), None, 400, { 'page': '' , 'page_size': '25' }))   

    @pytest.mark.xray_test_case("RST-2239")
    @pytest.mark.Regression
    def test_config_schedule_price_sailing_invalid_page(self):
        json_payload= json.dumps({"advancedFilter":'null',"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['config_schedule_price_sailing'], json.loads(json_payload), None, 400, { 'page': 'abc' , 'page_size': '25' }))     
    
    @pytest.mark.xray_test_case("RST-2240")
    @pytest.mark.Regression
    def test_config_schedule_price_sailing_blank_page_size(self):
        json_payload= json.dumps({"advancedFilter":'null',"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['config_schedule_price_sailing'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '' }))   

    @pytest.mark.xray_test_case("RST-2241")
    @pytest.mark.Regression
    def test_config_schedule_price_sailing_invalid_page_size(self):
        json_payload= json.dumps({"advancedFilter":'null',"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['config_schedule_price_sailing'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': 'abc' }))  

    @pytest.mark.xray_test_case("RST-2236")
    @pytest.mark.Regression
    def test_config_schedule_price_lettered_voyage(self):
        json_payload= json.dumps({"advancedFilter":'null',"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['config_schedule_price_lettered_voyage'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' }))
    
    @pytest.mark.xray_test_case("RST-2242")
    @pytest.mark.Regression
    def test_config_schedule_price_lettered_voyage_blank_page(self):
        json_payload= json.dumps({"advancedFilter":'null',"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['config_schedule_price_lettered_voyage'], json.loads(json_payload), None, 500, { 'page': '' , 'page_size': '25' }))
    
    @pytest.mark.xray_test_case("RST-2243")
    @pytest.mark.Regression
    def test_config_schedule_price_lettered_voyage_invalid_page(self):
        json_payload= json.dumps({"advancedFilter":'null',"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['config_schedule_price_lettered_voyage'], json.loads(json_payload), None, 500, { 'page': 'abc' , 'page_size': '25' }))

    @pytest.mark.xray_test_case("RST-2244")
    @pytest.mark.Regression
    def test_config_schedule_price_lettered_voyage_blank_page_size(self):
        json_payload= json.dumps({"advancedFilter":'null',"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['config_schedule_price_lettered_voyage'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '' }))
    
    @pytest.mark.xray_test_case("RST-2245")
    @pytest.mark.Regression
    def test_config_schedule_price_lettered_voyage_invalid_page_size(self):
        json_payload= json.dumps({"advancedFilter":'null',"sort":[]}) 
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['config_schedule_price_lettered_voyage'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': 'abc' }))


@pytest.mark.NCL_admin
@pytest.mark.NCL_manager
@pytest.mark.NCL_analyst
class TestConfigPage_NCL:

    @pytest.mark.xray_test_case("RST-2223")
    @pytest.mark.Regression
    def test_config_currencies(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_currencies'], None, 200, None, None))

    @pytest.mark.xray_test_case("RST-2224")
    @pytest.mark.Regression
    def test_config_meta_categories(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_meta_categories'], None, 200, None, None))

    @pytest.mark.xray_test_case("RST-2225")
    @pytest.mark.Regression
    def test_config_brands(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_brands'], None, 200, None, None))        

    @pytest.mark.xray_test_case("RST-2226")
    @pytest.mark.Regression
    def test_config_all_ships(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_all_ships'], None, 200, None, None))            

    @pytest.mark.xray_test_case("RST-2227")
    @pytest.mark.Regression
    def test_config_current_exchange(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_current_exchange'], None, 200, None, None))

    @pytest.mark.xray_test_case("RST-2237")
    @pytest.mark.Regression
    def test_config_commission(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_commission'], None, 200, None, None))    
    
    @pytest.mark.xray_test_case("RST-2229")
    @pytest.mark.Regression
    def test_config_psuedo_discount(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_psuedo_discount'], None, 200, None, None))    

    @pytest.mark.xray_test_case("RST-2230")
    @pytest.mark.Regression
    def test_config_rounding_rule(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_rounding_rule'], None, 200, None, None))            

    @pytest.mark.xray_test_case("RST-2231")
    @pytest.mark.Regression
    def test_config_currency_conversion(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_currency_conversion'], None, 200, None, None))          

    @pytest.mark.xray_test_case("RST-2232")
    @pytest.mark.Regression
    def test_config_currency_sailing_freeze(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_currency_sailing_freeze'], None, 200, None, None))          

    @pytest.mark.xray_test_case("RST-2233")
    @pytest.mark.Regression
    def test_config_cabin_category_ladder(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_cabin_category_ladder'], None, 200, None, None))          
    
    @pytest.mark.xray_test_case("RST-2234")
    @pytest.mark.Regression
    def test_config_t3_4_pricing(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['config_t3_4_pricing'], None, 200, None, None))          

    