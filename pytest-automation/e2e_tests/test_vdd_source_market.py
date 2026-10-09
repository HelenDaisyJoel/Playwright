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
class TestVDDSourceMarket:

    @pytest.mark.xray_test_case("RST-2189")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_correct_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_source_market'], None, 200, {'voyage_code':get_voyage_code,'meta_code':'voyage-inventory'}, None))

    @pytest.mark.xray_test_case("RST-2190")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_blank_value(self):
        response = BaseClient().get_request(url_config['vdd_source_market'], None, 500, {'voyage_code':'','meta_code':'voyage-inventory'}, None)


    @pytest.mark.xray_test_case("RST-2191")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_incorrect_value(self):
        response = BaseClient().get_request(url_config['vdd_source_market'], None, 500, {'voyage_code':'abc','meta_code':'voyage-inventory'}, None)


    @pytest.mark.xray_test_case("RST-2192")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_bookings_correct_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_source_market_bookings'], None, 200, {'voyage_code':get_voyage_code,'meta_code':'voyage-inventory','start_date':'All','end_date':'All'}, None))


    @pytest.mark.xray_test_case("RST-2193")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_bookings_blank_value(self):
        response = BaseClient().get_request(url_config['vdd_source_market_bookings'], None, 502, {'voyage_code':'','meta_code':'voyage-inventory','start_date':'All','end_date':'All'}, None)


    @pytest.mark.xray_test_case("RST-2194")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_bookings_incorrect_value(self):
        response = BaseClient().get_request(url_config['vdd_source_market_bookings'], None, 200, {'voyage_code':'abc','meta_code':'voyage-inventory','start_date':'All','end_date':'All'}, None)


    @pytest.mark.xray_test_case("RST-2195")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_room_type_correct_value(self, get_voyage_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_source_market_room_types'], None, 200, {'voyage_code':get_voyage_code,'meta_code':'voyage-inventory','start_date':'All','end_date':'All'}, None))


    @pytest.mark.xray_test_case("RST-2196")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_room_type_blank_value(self):
        response = BaseClient().get_request(url_config['vdd_source_market_room_types'], None, 400, {'voyage_code':'','meta_code':'voyage-inventory','start_date':'All','end_date':'All'}, None)


    @pytest.mark.xray_test_case("RST-2197")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_room_type_incorrect_value(self):
        response = BaseClient().get_request(url_config['vdd_source_market_room_types'], None, 200, {'voyage_code':'abc','meta_code':'voyage-inventory','start_date':'All','end_date':'All'}, None)


    @pytest.mark.xray_test_case("RST-2198")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_bookings_correct_value_with_time_filter(self, get_voyage_code):
        assert get_voyage_code is not None
        response = BaseClient().get_request(url_config['vdd_source_market_bookings'], None, 200, {'voyage_code':get_voyage_code,'meta_code':'voyage-inventory','start_date':'2025-08-24','end_date':'2025-09-07'}, None)


    @pytest.mark.xray_test_case("RST-2199")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_room_type_correct_value_with_time_filter(self, get_voyage_code):
        assert get_voyage_code is not None
        response = BaseClient().get_request(url_config['vdd_source_market_room_types'], None, 200, {'voyage_code':get_voyage_code,'meta_code':'voyage-inventory','start_date':'2025-08-24','end_date':'2025-09-07'}, None)


    @pytest.mark.xray_test_case("RST-2200")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_meta_correct_value(self, get_voyage_code,get_meta_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_source_market'], None, 200, {'voyage_code':get_voyage_code,'meta_code':get_meta_code}, None))


    @pytest.mark.xray_test_case("RST-2201")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_meta_blank_value(self, get_meta_code):
        response = BaseClient().get_request(url_config['vdd_source_market'], None, 200, {'voyage_code':'','meta_code':get_meta_code}, None)


    @pytest.mark.xray_test_case("RST-2202")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_meta_incorrect_value(self, get_meta_code):
        response = BaseClient().get_request(url_config['vdd_source_market'], None, 200, {'voyage_code':'abc','meta_code':get_meta_code}, None)


    @pytest.mark.xray_test_case("RST-2203")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_meta_bookings_correct_value(self, get_voyage_code,get_meta_code):
        assert get_voyage_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_source_market_bookings'], None, 200, {'voyage_code':get_voyage_code,'meta_code':get_meta_code,'start_date':'All','end_date':'All'}, None))


    @pytest.mark.xray_test_case("RST-2204")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_meta_bookings_blank_value(self, get_meta_code):
        assert get_meta_code is not None
        response = BaseClient().get_request(url_config['vdd_source_market_bookings'], None, 502, {'voyage_code':'','meta_code':get_meta_code,'start_date':'All','end_date':'All'}, None)


    @pytest.mark.xray_test_case("RST-2205")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_meta_bookings_incorrect_value(self, get_meta_code):
        assert get_meta_code is not None
        response = BaseClient().get_request(url_config['vdd_source_market_bookings'], None, 200, {'voyage_code':'abc','meta_code':get_meta_code,'start_date':'All','end_date':'All'}, None)


    @pytest.mark.xray_test_case("RST-2206")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_meta_room_type_correct_value(self, get_voyage_code,get_meta_code):
        assert get_voyage_code is not None
        assert get_meta_code is not None
        response = deserialize_json_to_object(BaseClient().get_request(url_config['vdd_source_market_room_types'], None, 200, {'voyage_code':get_voyage_code,'meta_code':get_meta_code,'start_date':'All','end_date':'All'}, None))


    @pytest.mark.xray_test_case("RST-2207")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_meta_room_type_blank_value(self, get_meta_code):
        assert get_meta_code is not None
        response = BaseClient().get_request(url_config['vdd_source_market_room_types'], None, 400, {'voyage_code':'','meta_code':get_meta_code,'start_date':'All','end_date':'All'}, None)


    @pytest.mark.xray_test_case("RST-2208")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_meta_room_type_incorrect_value(self, get_meta_code):
        assert get_meta_code is not None
        response = BaseClient().get_request(url_config['vdd_source_market_room_types'], None, 200, {'voyage_code':'abc','meta_code':get_meta_code,'start_date':'All','end_date':'All'}, None)


    @pytest.mark.xray_test_case("RST-2209")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_meta_bookings_correct_value_with_time_filter(self, get_voyage_code,get_meta_code):
        assert get_voyage_code is not None
        assert get_meta_code is not None
        response = BaseClient().get_request(url_config['vdd_source_market_bookings'], None, 200, {'voyage_code':get_voyage_code,'meta_code':get_meta_code,'start_date':'2025-08-24','end_date':'2025-09-07'}, None)


    @pytest.mark.xray_test_case("RST-2210")
    @pytest.mark.Regression
    def test_vdd_voyage_source_market_meta_room_type_correct_value_with_time_filter(self, get_voyage_code,get_meta_code):
        assert get_voyage_code is not None
        assert get_meta_code is not None
        response = BaseClient().get_request(url_config['vdd_source_market_room_types'], None, 200, {'voyage_code':get_voyage_code,'meta_code':get_meta_code,'start_date':'2025-08-24','end_date':'2025-09-07'}, None)

