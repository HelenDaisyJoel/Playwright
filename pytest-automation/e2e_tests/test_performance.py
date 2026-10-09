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
class TestPerformancePage:

    @pytest.mark.xray_test_case("RST-2246")
    @pytest.mark.Regression
    def test_rev_metrics_without_filter(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, None, None))


    @pytest.mark.xray_test_case("RST-2247")
    @pytest.mark.Regression
    def test_rev_metrics_with_filter(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, {'shipClasses': '1'}, None))


    @pytest.mark.xray_test_case("RST-2248")
    @pytest.mark.Regression
    def test_rev_trends_without_filter(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, None, None))


    @pytest.mark.xray_test_case("RST-2249")
    @pytest.mark.Regression
    def test_rev_trends_with_filter(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, {'shipClasses': '1'}, None))


    @pytest.mark.xray_test_case("RST-2250")
    @pytest.mark.Regression
    def test_rev_opp_without_filter(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, None, None))


    @pytest.mark.xray_test_case("RST-2251")
    @pytest.mark.Regression
    def test_rev_opp_with_filter(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, {'shipClasses': '1'}, None))


    @pytest.mark.xray_test_case("RST-2252")
    @pytest.mark.Regression
    def test_promo_analysis_without_filter(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, None, None))


    @pytest.mark.xray_test_case("RST-2253")
    @pytest.mark.Regression
    def test_promo_analysis_with_filter(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, {'shipClasses': '1'}, None))


    @pytest.mark.xray_test_case("RST-2254")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_shipclasses_valid_option(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, {'shipClasses': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, {'shipClasses': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, {'shipClasses': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, {'shipClasses': '1'}, None))

    @pytest.mark.xray_test_case("RST-2255")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_shipclasses_blank(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 500, {'shipClasses': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 500, {'shipClasses': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 500, {'shipClasses': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 500, {'shipClasses': ''}, None))

    @pytest.mark.xray_test_case("RST-2256")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_shipclasses_invalid_option(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 500, {'shipClasses': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 500, {'shipClasses': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 500, {'shipClasses': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 500, {'shipClasses': 'abc'}, None))


    @pytest.mark.xray_test_case("RST-2257")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_ship_valid_option(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, {'ships': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, {'ships': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, {'ships': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, {'ships': '1'}, None))

    @pytest.mark.xray_test_case("RST-2258")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_ship_blank(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 500, {'ships': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 500, {'ships': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 500, {'ships': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 500, {'ships': ''}, None))

    @pytest.mark.xray_test_case("RST-2259")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_ship_invalid_option(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 500, {'ships': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 500, {'ships': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 500, {'ships': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 500, {'ships': 'abc'}, None)) 


    @pytest.mark.xray_test_case("RST-2260")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_bookingHorizons_valid_option(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, {'bookingHorizons': '0-1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, {'bookingHorizons': '0-1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, {'bookingHorizons': '0-1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, {'bookingHorizons': '0-1'}, None))

    @pytest.mark.xray_test_case("RST-2261")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_bookingHorizons_blank(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, {'bookingHorizons': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, {'bookingHorizons': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, {'bookingHorizons': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, {'bookingHorizons': ''}, None))

    @pytest.mark.xray_test_case("RST-2262")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_bookingHorizons_invalid_option(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, {'bookingHorizons': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, {'bookingHorizons': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, {'bookingHorizons': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, {'bookingHorizons': 'abc'}, None)) 


    @pytest.mark.xray_test_case("RST-2263")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_regions_valid_option(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, {'regions': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, {'regions': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, {'regions': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, {'regions': '1'}, None))

    @pytest.mark.xray_test_case("RST-2264")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_regions_blank(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 500, {'regions': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 500, {'regions': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 500, {'regions': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 500, {'regions': ''}, None))

    @pytest.mark.xray_test_case("RST-2265")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_regions_invalid_option(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 500, {'regions': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 500, {'regions': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 500, {'regions': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 500, {'regions': 'abc'}, None))     


    @pytest.mark.xray_test_case("RST-2266")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_market_valid_option(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, {'markets': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, {'markets': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, {'markets': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, {'markets': '1'}, None))

    @pytest.mark.xray_test_case("RST-2267")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_market_blank(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 500, {'markets': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 500, {'markets': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 500, {'markets': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 500, {'markets': ''}, None))

    @pytest.mark.xray_test_case("RST-2268")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_market_invalid_option(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 500, {'markets': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 500, {'markets': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 500, {'markets': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 500, {'markets': 'abc'}, None))  


    @pytest.mark.xray_test_case("RST-2269")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_voyageLengths_valid_option(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, {'voyageLengths': '1-6'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, {'voyageLengths': '1-6'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, {'voyageLengths': '1-6'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, {'voyageLengths': '1-6'}, None))

    @pytest.mark.xray_test_case("RST-2270")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_voyageLengths_blank(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, {'voyageLengths': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, {'voyageLengths': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, {'voyageLengths': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, {'voyageLengths': ''}, None))

    @pytest.mark.xray_test_case("RST-2271")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_voyageLengths_invalid_option(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, {'voyageLengths': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, {'voyageLengths': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, {'voyageLengths': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, {'voyageLengths': 'abc'}, None))


    @pytest.mark.xray_test_case("RST-2272")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_metaCategory_valid_option(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, {'metaCategories': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, {'metaCategories': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, {'metaCategories': '1'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, {'metaCategories': '1'}, None))

    @pytest.mark.xray_test_case("RST-2273")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_metaCategory_blank(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, {'metaCategories': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, {'metaCategories': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, {'metaCategories': ''}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, {'metaCategories': ''}, None))

    @pytest.mark.xray_test_case("RST-2274")
    @pytest.mark.Regression
    def test_all_perf_endpoints_with_metaCategory_invalid_option(self):
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_metrics'], None, 200, {'metaCategories': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_trend'], None, 200, {'metaCategories': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_rev_opp'], None, 200, {'metaCategories': 'abc'}, None))
        response = deserialize_json_to_object(BaseClient().get_request(url_config['performance_promo_analysis'], None, 200, {'metaCategories': 'abc'}, None))                 
