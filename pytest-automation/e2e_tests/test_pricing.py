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
class TestPositivePrioPage:

    @pytest.mark.xray_test_case("RST-2101")
    @pytest.mark.Regression
    def test_get_pricing_page_1(self):
        json_payload= json.dumps({"filters":{},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))


    @pytest.mark.xray_test_case("RST-2102")
    @pytest.mark.Regression
    def test_get_pricing_page_2(self):
        json_payload= json.dumps({"filters":{},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '2' , 'page_size': '25' , 'startRow': '25', 'endRow': '50'}))


    @pytest.mark.xray_test_case("RST-2103")
    @pytest.mark.Regression
    def test_get_pricing_page_3(self):
        json_payload= json.dumps({"filters":{},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '3' , 'page_size': '25' , 'startRow': '50', 'endRow': '75'}))


    @pytest.mark.xray_test_case("RST-2104")
    @pytest.mark.Regression
    def test_get_pricing_page_4(self):
        json_payload= json.dumps({"filters":{},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '4' , 'page_size': '25' , 'startRow': '75', 'endRow': '100'}))


    @pytest.mark.xray_test_case("RST-2105")
    @pytest.mark.Regression
    def test_get_pricing_filter_voyage_name(self):
        json_payload= json.dumps({"filters":{"filterType":"text","colId":"voyage_info.voyage_code","type":"contains","filter":"JOY"},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))


    @pytest.mark.xray_test_case("RST-2106")
    @pytest.mark.Regression
    def test_get_pricing_filter_dept_date(self):
        json_payload= json.dumps({"filters":{"filterType":"date","colId":"voyage_info.departure_date","type":"equals","filter":"2025-12-31"},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))


    @pytest.mark.xray_test_case("RST-2107")
    @pytest.mark.Regression
    def test_get_pricing_filter_voyage_length(self):
        json_payload= json.dumps({"filters":{"filterType":"number","colId":"voyage_info.duration","type":"equals","filter":4},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))


    @pytest.mark.xray_test_case("RST-2108")
    @pytest.mark.Regression
    def test_get_pricing_filter_rev_opp(self):
        json_payload= json.dumps({"filters":{"filterType":"number","colId":"revenue_opportunity","type":"greaterThan","filter":10000},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))


    @pytest.mark.xray_test_case("RST-2109")
    @pytest.mark.Regression
    def test_get_pricing_filter_priority(self):
        json_payload= json.dumps({"filters":{"filterType":"number","colId":"priority","type":"equals","filter":2},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))   


    @pytest.mark.xray_test_case("RST-2110")
    @pytest.mark.Regression
    def test_get_pricing_filter_blackout_true(self):
        json_payload= json.dumps({"filters":{"filterType":"boolean","colId":"related_priority_info.blackout_status","type":"true"},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'})) 
        
    @pytest.mark.xray_test_case("RST-2111")
    @pytest.mark.Regression
    def test_get_pricing_filter_blackout_false(self):
        json_payload= json.dumps({"filters":{"filterType":"boolean","colId":"related_priority_info.blackout_status","type":"false"},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))    
        

    @pytest.mark.xray_test_case("RST-2112")
    @pytest.mark.Regression
    def test_get_pricing_filter_boLiftDate_blank(self):
        json_payload= json.dumps({"filters":{"filterType":"date","colId":"related_priority_info.blackout_lift_date","type":"null"},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))


    @pytest.mark.xray_test_case("RST-2113")
    @pytest.mark.Regression
    def test_get_pricing_filter_boLiftDate_notBlank(self):
        json_payload= json.dumps({"filters":{"filterType":"date","colId":"related_priority_info.blackout_lift_date","type":"notNull"},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'})) 


    @pytest.mark.xray_test_case("RST-2114")
    @pytest.mark.Regression
    def test_get_pricing_filter_meta(self):
        json_payload= json.dumps({"filters":{"filterType":"text","colId":"meta","type":"contains","filter":"BAL"},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))


    @pytest.mark.xray_test_case("RST-2115")
    @pytest.mark.Regression
    def test_get_pricing_filter_opportunity_spill(self):
        json_payload_spill= json.dumps({"filters":{"filterType":"text","colId":"related_priority_info.opportunity","type":"contains","filter":"spill"},"sort":[]})
        post_response_spill = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload_spill), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))

    @pytest.mark.xray_test_case("RST-2116")
    @pytest.mark.Regression
    def test_get_pricing_filter_opportunity_spoil(self):
        json_payload_spoil= json.dumps({"filters":{"filterType":"text","colId":"related_priority_info.opportunity","type":"contains","filter":"spoil"},"sort":[]})
        post_response_spoil = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload_spoil), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))
        

    @pytest.mark.xray_test_case("RST-2117")
    @pytest.mark.Regression
    def test_get_pricing_filter_opportunity_noChange(self):
        json_payload= json.dumps({"filters":{"filterType":"text","colId":"related_priority_info.opportunity","type":"contains","filter":"no change"},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))


    @pytest.mark.xray_test_case("RST-2118")
    @pytest.mark.Regression
    def test_get_pricing_filter_overbookingOpportunity_true(self):
        json_payload= json.dumps({"filters":{"filterType":"boolean","colId":"related_priority_info.ovb_opportunity","type":"true"},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))


    @pytest.mark.xray_test_case("RST-2119")
    @pytest.mark.Regression
    def test_get_pricing_filter_overbookingOpportunity_false(self):
        json_payload= json.dumps({"filters":{"filterType":"boolean","colId":"related_priority_info.ovb_opportunity","type":"false"},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))



    @pytest.mark.xray_test_case("RST-2120")
    @pytest.mark.Regression
    def test_get_pricing_filter_pricingOpportunity_true(self):
        json_payload= json.dumps({"filters":{"filterType":"boolean","colId":"related_priority_info.price_change_opportunity","type":"true"},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))


    @pytest.mark.xray_test_case("RST-2121")
    @pytest.mark.Regression
    def test_get_pricing_filter_pricingOpportunity_false(self):
        json_payload= json.dumps({"filters":{"filterType":"boolean","colId":"related_priority_info.price_change_opportunity","type":"false"},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))


    @pytest.mark.xray_test_case("RST-2122")
    @pytest.mark.Regression
    def test_get_pricing_filter_sailawayOpportunity_true(self):
        json_payload= json.dumps({"filters":{"filterType":"boolean","colId":"related_priority_info.sailaway_opportunity","type":"true"},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))
        assert post_response is not None, "Pricing page response is None"

    @pytest.mark.xray_test_case("RST-2123")
    @pytest.mark.Regression
    def test_get_pricing_filter_sailawayOpportunity_false(self):
        json_payload= json.dumps({"filters":{"filterType":"boolean","colId":"related_priority_info.sailaway_opportunity","type":"false"},"sort":[]})
        post_response = deserialize_json_to_object(BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'}))
        
    
    @pytest.mark.xray_test_case("RST-2124")
    @pytest.mark.Regression
    def test_get_pricing_page_blank_params(self):
        json_payload= json.dumps({"filters":{},"sort":[]})
        post_response = BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 400, { 'page': '' , 'page_size': '' , 'startRow': '', 'endRow': ''})
        response_json = json.loads(post_response)
        assert response_json["error"] == "Invalid page."


    @pytest.mark.xray_test_case("RST-2125")
    @pytest.mark.Regression
    def test_get_pricing_page_invalid_page(self):
        json_payload= json.dumps({"filters":{},"sort":[]})
        post_response = BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 400, { 'page': 'abc' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'})
        response_json = json.loads(post_response)
        assert response_json["error"] == "Invalid page."


    @pytest.mark.xray_test_case("RST-2126")
    @pytest.mark.Regression
    def test_get_pricing_page_outOfBound_page(self):
        json_payload= json.dumps({"filters":{},"sort":[]})
        post_response = BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 400, { 'page': '99999' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'})
        response_json = json.loads(post_response)
        assert response_json["error"] == "Invalid page."


    @pytest.mark.xray_test_case("RST-2127")
    @pytest.mark.Regression
    def test_get_pricing_page_invalid_pageSize(self):
        json_payload= json.dumps({"filters":{},"sort":[]})
        post_response = BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': 'abc' , 'startRow': '0', 'endRow': '25'})


    @pytest.mark.xray_test_case("RST-2128")
    @pytest.mark.Regression
    def test_get_pricing_page_outOfBound_pageSize(self):
        json_payload= json.dumps({"filters":{},"sort":[]})
        post_response = BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '999999' , 'startRow': '0', 'endRow': '25'})


    @pytest.mark.xray_test_case("RST-2129")
    @pytest.mark.Regression
    def test_get_pricing_page_invalid_startRow(self):
        json_payload= json.dumps({"filters":{},"sort":[]})
        post_response = BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': 'abc', 'endRow': '25'})


    @pytest.mark.xray_test_case("RST-2130")
    @pytest.mark.Regression
    def test_get_pricing_page_invalid_endRow(self):
        json_payload= json.dumps({"filters":{},"sort":[]})
        post_response = BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': 'abc'})


    @pytest.mark.xray_test_case("RST-2131")
    @pytest.mark.Regression
    def test_get_pricing_page_outOfBound_startRow(self):
        json_payload= json.dumps({"filters":{},"sort":[]})
        post_response = BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '99999', 'endRow': '25'})


    @pytest.mark.xray_test_case("RST-2132")
    @pytest.mark.Regression
    def test_get_pricing_page_outOfBound_endRow(self):
        json_payload= json.dumps({"filters":{},"sort":[]})
        post_response = BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '99999'})


    @pytest.mark.xray_test_case("RST-2133")
    @pytest.mark.Regression
    def test_get_pricing_filter_invalid_column_name(self):
        json_payload= json.dumps({"filters":{"filterType":"text","colId":"voyage_info.voyage_code","type":"contains","filter":"JOY"},"sort":[]})
        post_response = BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'})


    @pytest.mark.xray_test_case("RST-2134")
    @pytest.mark.Regression
    def test_get_pricing_filter_invalid_type(self):
        json_payload= json.dumps({"filters":{"filterType":"text","colId":"voyage_info.voyage_code","type":"abc","filter":"JOY"},"sort":[]})
        post_response = BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'})


    @pytest.mark.xray_test_case("RST-2135")
    @pytest.mark.Regression
    def test_get_pricing_filter_invalid_filter(self):
        json_payload= json.dumps({"filters":{"filterType":"text","colId":"voyage_info.voyage_code","type":"equals","filter":"@12a"},"sort":[]})
        post_response = BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'})


    @pytest.mark.xray_test_case("RST-2136")
    @pytest.mark.Regression
    def test_get_pricing_filter_invalid_filterType(self):
        json_payload= json.dumps({"filters":{"filterType":"abc","colId":"voyage_info.voyage_code","type":"equals","filter":"JOY"},"sort":[]})
        post_response = BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'})


    @pytest.mark.xray_test_case("RST-2137")
    @pytest.mark.Regression
    def test_get_pricing_filter_blank_values(self):
        json_payload= json.dumps({"filters":{"filterType":"","colId":"","type":"","filter":""},"sort":[]})
        post_response = BaseClient().post_request(url_config['pricing_table_url'], json.loads(json_payload), None, 200, { 'page': '1' , 'page_size': '25' , 'startRow': '0', 'endRow': '25'})
