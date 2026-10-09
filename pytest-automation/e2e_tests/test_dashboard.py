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
class TestDashboard:

    @pytest.mark.xray_test_case("RST-2057")
    @pytest.mark.Regression
    def test_get_dashboard_filter(self):
        get_response = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, None))
        assert get_response is not None, "Dashboard summary response is None"

        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response, attr), f"Missing attribute '{attr}' in response"


    @pytest.mark.xray_test_case("RST-2058")
    @pytest.mark.Regression
    def test_get_dashboard_summary(self):
        get_response = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, None))
        
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response, attr), f"Missing attribute '{attr}' in response"


    @pytest.mark.xray_test_case("RST-2059")
    @pytest.mark.Regression
    def test_get_dashboard_rate_split_region(self):
        get_response = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region' }))
        
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response, attr), f"Missing attribute '{attr}' in response"


    @pytest.mark.xray_test_case("RST-2060")
    @pytest.mark.Regression
    def test_get_dashboard_rate_split_ship_class(self):
        get_response = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'ship_class' }))
        
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response, attr), f"Missing attribute '{attr}' in response"    


    @pytest.mark.xray_test_case("RST-2061")
    @pytest.mark.Regression
    def test_get_dashboard_rate_split_voyage_length(self):
        get_response = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'voyage_length' }))
        
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response, attr), f"Missing attribute '{attr}' in response"       


    @pytest.mark.xray_test_case("RST-2062")
    @pytest.mark.Regression
    def test_get_dashboard_rate_split_booking_horizon(self):
        get_response = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'booking_horizon' }))
        
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response, attr), f"Missing attribute '{attr}' in response"       


    @pytest.mark.xray_test_case("RST-2063")
    @pytest.mark.Regression
    def test_get_dashboard_rate_split_meta_category(self):
        get_response = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'meta_category' }))
        
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response, attr), f"Missing attribute '{attr}' in response"       


    @pytest.mark.xray_test_case("RST-2064")
    @pytest.mark.Regression
    def test_get_dashboard_opportunity_breakdown_region(self):
        get_response = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region' }))
        
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response, attr), f"Missing attribute '{attr}' in response"


    @pytest.mark.xray_test_case("RST-2065")
    @pytest.mark.Regression
    def test_get_dashboard_opportunity_breakdown_ship_class(self):
        get_response = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'ship_class' }))
        
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response, attr), f"Missing attribute '{attr}' in response"    


    @pytest.mark.xray_test_case("RST-2066")
    @pytest.mark.Regression
    def test_get_dashboard_opportunity_breakdown_voyage_length(self):
        get_response = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'voyage_length' }))
        
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response, attr), f"Missing attribute '{attr}' in response"       


    @pytest.mark.xray_test_case("RST-2067")
    @pytest.mark.Regression
    def test_get_dashboard_opportunity_breakdown_booking_horizon(self):
        get_response = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'booking_horizon' }))
        
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response, attr), f"Missing attribute '{attr}' in response"       


    @pytest.mark.xray_test_case("RST-2068")
    @pytest.mark.Regression
    def test_get_dashboard_opportunity_breakdown_meta_category(self):
        get_response = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'meta_category' }))
        
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response, attr), f"Missing attribute '{attr}' in response"       

    @pytest.mark.xray_test_case("RST-2069")  
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_shipclass_single_select(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'shipClasses' : '1' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'shipClasses' : '1' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'shipClasses' : '1' }))    
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'shipClasses' : '1' }))    
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"    


    @pytest.mark.xray_test_case("RST-2070")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_shipclass_multi_select(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'shipClasses' : '1', 'shipClasses' : '2', 'shipClasses' : '3' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'shipClasses' : '1', 'shipClasses' : '2', 'shipClasses' : '3' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'shipClasses' : '1', 'shipClasses' : '2', 'shipClasses' : '3' }))    
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'shipClasses' : '1', 'shipClasses' : '2', 'shipClasses' : '3'}))    
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"               


    @pytest.mark.xray_test_case("RST-2071")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_ships_single_select(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'ships' : '1' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'ships' : '1' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'ships' : '1' }))    
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'ships' : '1' }))    
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"    


    @pytest.mark.xray_test_case("RST-2072")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_ships_multi_select(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'ships' : '1', 'ships' : '2', 'ships' : '3' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'ships' : '1', 'ships' : '2', 'ships' : '3' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'ships' : '1', 'ships' : '2', 'ships' : '3' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'ships' : '1', 'ships' : '2', 'ships' : '3' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"  


    @pytest.mark.xray_test_case("RST-2073")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_departure_date_range(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'departureStart' : '2025-10-01', 'departureEnd' : '2025-10-15' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'departureStart' : '2025-10-01', 'departureEnd' : '2025-10-15' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'departureStart' : '2025-10-01', 'departureEnd' : '2025-10-15' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'departureStart' : '2025-10-01', 'departureEnd' : '2025-10-15' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"                 


    @pytest.mark.xray_test_case("RST-2074")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_booking_horizon_single_select(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'bookingHorizons' : '0-1' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'bookingHorizons' : '0-1' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'bookingHorizons' : '0-1' }))    
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'bookingHorizons' : '0-1' }))    
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"    


    @pytest.mark.xray_test_case("RST-2075")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_booking_horizon_multi_select(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'bookingHorizons' : '0-1', 'bookingHorizons' : '1-3', 'bookingHorizons' : '3-6' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'bookingHorizons' : '0-1', 'bookingHorizons' : '1-3', 'bookingHorizons' : '3-6' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'bookingHorizons' : '0-1', 'bookingHorizons' : '1-3', 'bookingHorizons' : '3-6' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'bookingHorizons' : '0-1', 'bookingHorizons' : '1-3', 'bookingHorizons' : '3-6' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"  


    @pytest.mark.xray_test_case("RST-2076")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_region_single_select(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'region' : '1' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'region' : '1' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'region' : '1' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'region' : '1' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"    


    @pytest.mark.xray_test_case("RST-2077")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_region_multi_select(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'region' : '1', 'region' : '2', 'region' : '3' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'region' : '1', 'region' : '2', 'region' : '3' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'region' : '1', 'region' : '2', 'region' : '3' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'region' : '1', 'region' : '2', 'region' : '3' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"  


    @pytest.mark.xray_test_case("RST-2078")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_market_single_select(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'markets' : '1' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'markets' : '1' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'markets' : '1' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'markets' : '1' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"    


    @pytest.mark.xray_test_case("RST-2079")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_market_multi_select(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'markets' : '1', 'markets' : '2', 'markets' : '3' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'markets' : '1', 'markets' : '2', 'markets' : '3' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'markets' : '1', 'markets' : '2', 'markets' : '3' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'markets' : '1', 'markets' : '2', 'markets' : '3' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"  


    @pytest.mark.xray_test_case("RST-2080")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_voyageLengths_single_select(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'voyageLengths' : '1-6' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'voyageLengths' : '1-6' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'voyageLengths' : '1-6' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'voyageLengths' : '1-6' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"    


    @pytest.mark.xray_test_case("RST-2081")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_voyageLengths_multi_select(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'voyageLengths' : '1-6', 'voyageLengths' : '7-10', 'voyageLengths' : '11-14' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'voyageLengths' : '1-6', 'voyageLengths' : '7-10', 'voyageLengths' : '11-14' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'voyageLengths' : '1-6', 'voyageLengths' : '7-10', 'voyageLengths' : '11-14' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'voyageLengths' : '1-6', 'voyageLengths' : '7-10', 'voyageLengths' : '11-14' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"          


    @pytest.mark.xray_test_case("RST-2082")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_metaCategories_single_select(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'metaCategories' : '1' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'metaCategories' : '1' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'metaCategories' : '1' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'metaCategories' : '1' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"    


    @pytest.mark.xray_test_case("RST-2083")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_metaCategories_multi_select(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'metaCategories' : '1', 'metaCategories' : '2', 'metaCategories' : '3' }))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'metaCategories' : '1', 'metaCategories' : '2', 'metaCategories' : '3' }))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'metaCategories' : '1', 'metaCategories' : '2', 'metaCategories' : '3' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'metaCategories' : '1', 'metaCategories' : '2', 'metaCategories' : '3' }))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"     


    @pytest.mark.xray_test_case("RST-2084")        
    @pytest.mark.Regression
    def test_get_dashboard_all_global_filter(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'metaCategories' : '1', 'voyageLengths' : '1-6', 'markets' : '1', 'region' : '1', 'bookingHorizons' : '0-1', 'departureStart' : '2025-10-01', 'departureEnd' : '2025-10-15', 'ships' : '1', 'shipClasses' : '1'}))
        assert get_response_filters is not None, "Dashboard summary response is None"
        expected_attributes = ['regions', 'markets', 'meta_categories', 'ship_classes', 'ships']
        for attr in expected_attributes:
            assert hasattr(get_response_filters, attr), f"Missing attribute '{attr}' in response"

        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'metaCategories' : '1', 'voyageLengths' : '1-6', 'markets' : '1', 'region' : '1', 'bookingHorizons' : '0-1', 'departureStart' : '2025-10-01', 'departureEnd' : '2025-10-15', 'shipClasses' : '1', 'ships' : '1'}))
        expected_attributes = ['summary', 'user_review_summary']
        for attr in expected_attributes:
            assert hasattr(get_response_summary, attr), f"Missing attribute '{attr}' in response"

        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'metaCategories' : '1', 'voyageLengths' : '1-6', 'markets' : '1', 'region' : '1', 'bookingHorizons' : '0-1', 'departureStart' : '2025-10-01', 'departureEnd' : '2025-10-15', 'ships' : '1', 'shipClasses' : '1'}))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_rate_split, attr), f"Missing attribute '{attr}' in response"       

        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'metaCategories' : '1', 'voyageLengths' : '1-6', 'markets' : '1', 'region' : '1', 'bookingHorizons' : '0-1', 'departureStart' : '2025-10-01', 'departureEnd' : '2025-10-15', 'ships' : '1', 'shipClasses' : '1'}))
        expected_attributes = ['data', 'group_by']
        for attr in expected_attributes:
            assert hasattr(get_response_opp_breakdown, attr), f"Missing attribute '{attr}' in response"    


    @pytest.mark.xray_test_case("RST-2085")  
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_shipclass_invalid_option(self):
        get_response_filters = BaseClient().get_request(url_config['dashboard_filters'], None, 500, { 'shipClasses' : 'abc' })
        get_response_summary = BaseClient().get_request(url_config['dashboard_summary'], None, 500, { 'shipClasses' : 'abc' })
        get_response_rate_split = BaseClient().get_request(url_config['dashboard_rate_split'], None, 500, { 'group_by' : 'region', 'shipClasses' : 'abc' })
        get_response_opp_breakdown = BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 500, { 'group_by' : 'region', 'shipClasses' : 'abc' })
        

    @pytest.mark.xray_test_case("RST-2086")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_shipclass_outOfBound_option(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'shipClasses' : '99999' }))
        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'shipClasses' : '99999' }))
        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'shipClasses' : '99999' }))
        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'shipClasses' : '99999' }))


    @pytest.mark.xray_test_case("RST-2087")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_ships_invalid_option(self):
        get_response_filters = BaseClient().get_request(url_config['dashboard_filters'], None, 500, { 'ships' : 'abc' })
        get_response_summary = BaseClient().get_request(url_config['dashboard_summary'], None, 500, { 'ships' : 'abc' })
        get_response_rate_split = BaseClient().get_request(url_config['dashboard_rate_split'], None, 500, { 'group_by' : 'region', 'ships' : 'abc' })
        get_response_opp_breakdown = BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 500, { 'group_by' : 'region', 'ships' : 'abc' })
        

    @pytest.mark.xray_test_case("RST-2088")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_ships_outOfBound_option(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'ships' : '99999' }))
        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'ships' : '99999' }))
        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'ships' : '99999' }))
        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'ships' : '99999' }))


    @pytest.mark.xray_test_case("RST-2089")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_departure_date_range_invalid_option(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'departureStart' : '2025-15-15', 'departureEnd' : '2025-15-15' }))
        get_response_summary = BaseClient().get_request(url_config['dashboard_summary'], None, 500, { 'departureStart' : '2025-15-15', 'departureEnd' : '2025-15-15' })
        get_response_rate_split = BaseClient().get_request(url_config['dashboard_rate_split'], None, 500, { 'group_by' : 'region', 'departureStart' : '2025-15-15', 'departureEnd' : '2025-15-15' })
        get_response_opp_breakdown = BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 500, { 'group_by' : 'region', 'departureStart' : '2025-15-15', 'departureEnd' : '2025-15-15' })
        

    @pytest.mark.xray_test_case("RST-2090")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_departure_date_range_outOfBound_option(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'departureStart' : '2025-12-15', 'departureEnd' : '2025-01-15' }))
        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'departureStart' : '2025-12-15', 'departureEnd' : '2025-01-15' }))
        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'departureStart' : '2025-12-15', 'departureEnd' : '2025-01-15' }))
        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'departureStart' : '2025-12-15', 'departureEnd' : '2025-01-15' }))


    @pytest.mark.xray_test_case("RST-2091")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_booking_horizon_invalid_option(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'bookingHorizons' : 'abc' }))
        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'bookingHorizons' : 'abc' }))
        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'bookingHorizons' : 'abc' }))
        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'bookingHorizons' : 'abc' }))
        

    @pytest.mark.xray_test_case("RST-2092")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_booking_horizon_outOfBound_option(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'bookingHorizons' : '99999' }))
        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'bookingHorizons' : '99999' }))
        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'bookingHorizons' : '99999' }))
        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'bookingHorizons' : '99999' }))


    @pytest.mark.xray_test_case("RST-2093")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_region_invalid_option(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'region' : 'abc' }))
        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'region' : 'abc' }))
        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'region' : 'abc' }))
        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'region' : 'abc' }))
        

    @pytest.mark.xray_test_case("RST-2094")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_region_outOfBound_option(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'region' : '99999' }))
        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'region' : '99999' }))
        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'region' : '99999' }))
        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'region' : '99999' }))


    @pytest.mark.xray_test_case("RST-2095")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_markets_invalid_option(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'markets' : 'abc' }))
        get_response_summary = BaseClient().get_request(url_config['dashboard_summary'], None, 500, { 'markets' : 'abc' })
        get_response_rate_split = BaseClient().get_request(url_config['dashboard_rate_split'], None, 500, { 'group_by' : 'region', 'markets' : 'abc' })
        get_response_opp_breakdown = BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 500, { 'group_by' : 'region', 'markets' : 'abc' })
        

    @pytest.mark.xray_test_case("RST-2096")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_markets_outOfBound_option(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'markets' : '99999' }))
        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'markets' : '99999' }))
        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'markets' : '99999' }))
        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'markets' : '99999' }))


    @pytest.mark.xray_test_case("RST-2097")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_voyageLengths_invalid_option(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'voyageLengths' : 'abc' }))
        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'voyageLengths' : 'abc' }))
        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'voyageLengths' : 'abc' }))
        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'voyageLengths' : 'abc' }))
        

    @pytest.mark.xray_test_case("RST-2098")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_voyageLengths_outOfBound_option(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'voyageLengths' : '99999' }))
        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'voyageLengths' : '99999' }))
        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'voyageLengths' : '99999' }))
        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'voyageLengths' : '99999' }))


    @pytest.mark.xray_test_case("RST-2099")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_metaCategories_invalid_option(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'metaCategories' : 'abc' }))
        get_response_summary = BaseClient().get_request(url_config['dashboard_summary'], None, 500, { 'metaCategories' : 'abc' })
        get_response_rate_split = BaseClient().get_request(url_config['dashboard_rate_split'], None, 500, { 'group_by' : 'region', 'metaCategories' : 'abc' })
        get_response_opp_breakdown = BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 500, { 'group_by' : 'region', 'metaCategories' : 'abc' })
        

    @pytest.mark.xray_test_case("RST-2100")
    @pytest.mark.Regression
    def test_get_dashboard_global_filter_metaCategories_outOfBound_option(self):
        get_response_filters = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_filters'], None, 200, { 'metaCategories' : '99999' }))
        get_response_summary = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_summary'], None, 200, { 'metaCategories' : '99999' }))
        get_response_rate_split = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_rate_split'], None, 200, { 'group_by' : 'region', 'metaCategories' : '99999' }))
        get_response_opp_breakdown = deserialize_json_to_object(BaseClient().get_request(url_config['dashboard_opportunity_breakdown'], None, 200, { 'group_by' : 'region', 'metaCategories' : '99999' }))
