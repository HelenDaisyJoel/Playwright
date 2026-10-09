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
class TestVDDPromotion:

    @pytest.mark.xray_test_case("RST-2165")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_correct_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_promo_market'], None, 200, None, get_voyage_code))


    @pytest.mark.xray_test_case("RST-2166")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_blank_value(self):
        response = BaseClient().get_request(url_config['vdd_promo_market'], None, 404, None, '')


    @pytest.mark.xray_test_case("RST-2167")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_incorrect_value(self):
        response = BaseClient().get_request(url_config['vdd_promo_market'], None, 200, None, 'abc')


    @pytest.mark.xray_test_case("RST-2168")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_with_time_correct_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_promo_market'], None, 200, {'start_date':'2025-08-24', 'end_date':'2025-09-07'}, get_voyage_code))


    @pytest.mark.xray_test_case("RST-2169")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_with_time_blank_value(self):
        response = BaseClient().get_request(url_config['vdd_promo_market'], None, 404, {'start_date':'2025-08-24', 'end_date':'2025-09-07'}, '')


    @pytest.mark.xray_test_case("RST-2170")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_with_time_incorrect_value(self):
        response = BaseClient().get_request(url_config['vdd_promo_market'], None, 200, {'start_date':'2025-08-24', 'end_date':'2025-09-07'}, 'abc')


    @pytest.mark.xray_test_case("RST-2171")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_with_bookingType_correct_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_promo_market'], None, 200, {'promo_market':'domestic', 'promo_audience':'targeted'}, get_voyage_code))


    @pytest.mark.xray_test_case("RST-2172")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_with_bookingType_blank_value(self):
        response = BaseClient().get_request(url_config['vdd_promo_market'], None, 404, {'promo_market':'domestic', 'promo_audience':'targeted'}, '')


    @pytest.mark.xray_test_case("RST-2173")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_with_bookingType_incorrect_value(self):
        response = BaseClient().get_request(url_config['vdd_promo_market'], None, 200, {'promo_market':'domestic', 'promo_audience':'targeted'}, 'abc')    


    @pytest.mark.xray_test_case("RST-2174")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_with_bookingType_time_correct_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_promo_market'], None, 200, {'promo_market':'domestic', 'promo_audience':'targeted', 'start_date':'2025-08-24', 'end_date':'2025-09-07'}, get_voyage_code))


    @pytest.mark.xray_test_case("RST-2175")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_with_bookingType_time_blank_value(self):
        response = BaseClient().get_request(url_config['vdd_promo_market'], None, 404, {'promo_market':'domestic', 'promo_audience':'targeted', 'start_date':'2025-08-24', 'end_date':'2025-09-07'}, '')


    @pytest.mark.xray_test_case("RST-2176")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_with_bookingType_time_incorrect_value(self):
        response = BaseClient().get_request(url_config['vdd_promo_market'], None, 200, {'promo_market':'domestic', 'promo_audience':'targeted', 'start_date':'2025-08-24', 'end_date':'2025-09-07'}, 'abc')      


    @pytest.mark.xray_test_case("RST-2177")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_meta_correct_value(self, get_voyage_code,get_meta_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_promo_market_meta'], None, 200, None, get_voyage_code,get_meta_code))


    @pytest.mark.xray_test_case("RST-2178")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_meta_blank_value(self, get_voyage_code):
        response = BaseClient().get_request(url_config['vdd_promo_market_meta'], None, 404, None, get_voyage_code,'')


    @pytest.mark.xray_test_case("RST-2179")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_meta_incorrect_value(self, get_voyage_code):
        response = BaseClient().get_request(url_config['vdd_promo_market_meta'], None, 200, None, get_voyage_code,'abc')


    @pytest.mark.xray_test_case("RST-2180")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_meta_with_time_correct_value(self, get_voyage_code,get_meta_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_promo_market_meta'], None, 200, {'start_date':'2025-08-24', 'end_date':'2025-09-07'}, get_voyage_code,get_meta_code))


    @pytest.mark.xray_test_case("RST-2181")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_meta_with_time_blank_value(self, get_voyage_code):
        response = BaseClient().get_request(url_config['vdd_promo_market_meta'], None, 404, {'start_date':'2025-08-24', 'end_date':'2025-09-07'}, get_voyage_code,'')


    @pytest.mark.xray_test_case("RST-2182")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_meta_with_time_incorrect_value(self, get_voyage_code):
        response = BaseClient().get_request(url_config['vdd_promo_market_meta'], None, 200, {'start_date':'2025-08-24', 'end_date':'2025-09-07'}, get_voyage_code,'abc')


    @pytest.mark.xray_test_case("RST-2183")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_meta_with_bookingType_correct_value(self, get_voyage_code,get_meta_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_promo_market_meta'], None, 200, {'promo_market':'domestic', 'promo_audience':'targeted'}, get_voyage_code,get_meta_code))


    @pytest.mark.xray_test_case("RST-2184")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_meta_with_bookingType_blank_value(self, get_voyage_code):
        response = BaseClient().get_request(url_config['vdd_promo_market_meta'], None, 404, {'promo_market':'domestic', 'promo_audience':'targeted'}, get_voyage_code,'')


    @pytest.mark.xray_test_case("RST-2185")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_meta_with_bookingType_incorrect_value(self, get_voyage_code):
        response = BaseClient().get_request(url_config['vdd_promo_market_meta'], None, 200, {'promo_market':'domestic', 'promo_audience':'targeted'}, get_voyage_code,'abc')    


    @pytest.mark.xray_test_case("RST-2186")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_meta_with_bookingType_time_correct_value(self, get_voyage_code,get_meta_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_promo_market_meta'], None, 200, {'promo_market':'domestic', 'promo_audience':'targeted', 'start_date':'2025-08-24', 'end_date':'2025-09-07'}, get_voyage_code,get_meta_code))


    @pytest.mark.xray_test_case("RST-2187")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_meta_with_bookingType_time_blank_value(self, get_voyage_code):
        response = BaseClient().get_request(url_config['vdd_promo_market_meta'], None, 404, {'promo_market':'domestic', 'promo_audience':'targeted', 'start_date':'2025-08-24', 'end_date':'2025-09-07'}, get_voyage_code,'')


    @pytest.mark.xray_test_case("RST-2188")
    @pytest.mark.Regression
    def test_vdd_voyage_promo_market_meta_with_bookingType_time_incorrect_value(self, get_voyage_code):
        response = BaseClient().get_request(url_config['vdd_promo_market_meta'], None, 200, {'promo_market':'domestic', 'promo_audience':'targeted', 'start_date':'2025-08-24', 'end_date':'2025-09-07'}, get_voyage_code,'abc')         
