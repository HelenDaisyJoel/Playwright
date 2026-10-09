import { test } from '../fixtures/baseFixture';
import { verifyText, verifyVisibility, verifyUrl, actionClick } from '../utils/actions';

test.describe(' Config page @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst', () => {
    test('verify user is able to view different components on config page [RST-2522] @smoke', async ({ page }) => {
        test.setTimeout(180000);
        await page.route('**/api/catalog/currencies/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/catalog/meta-categories/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/brands/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/all-ships/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/configuration/current-exchange/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/configuration/cabin-category-ladder/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/configuration/scheduled-price-changes/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/config/currency-panes/current-exchange');
        // Recover from transient SAML redirect by re-entering the app once.
        if (page.url().includes('/sso/saml')) {
            await page.goto('/dashboard');
            await page.waitForURL('**/dashboard');
            await page.goto('/config/currency-panes/current-exchange');
        }
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/config/currency-panes');
        await verifyText(page, 'config', 'config_page_heading', ' Config ');
        await verifyText(page, 'config', 'config_page_heading_subtext', ' Configure analyst workflows, auto-deploy logic, and fare execution settings by role and cabin category. ');
      
        await verifyText(page, 'config', 'config_heading', ' Currency Panes | ');
        await verifyText(page, 'config', 'config_sub_tab_heading', 'Exchange rates');

        await verifyText(page, 'config', 'config_currency_tab', ' Currency Panes ');
        // Fare Execution tab is not available in UI so commented it out for now 27-07-2026
        // await verifyText(page, 'config', 'config_fareExecution_tab', ' Fare Execution ');
         if(process.env.BRAND !=='NCL'){
            await verifyText(page, 'config', 'config_schedulePriceChanges_tab', ' Scheduled price changes ');
        }
        
        if(process.env.BRAND !=='NCL'){
            await verifyText(page, 'config', 'config_side_list_items', ' Exchange rates ', { index : 0 });
            await verifyText(page, 'config', 'config_side_list_items', ' Currency exchange overrides ', { index : 1 });
            await verifyText(page, 'config', 'config_side_list_items', ' Commissions ', { index : 2 });
            await verifyText(page, 'config', 'config_side_list_items', ' Tactical fare discount ', { index : 3 });
            await verifyText(page, 'config', 'config_side_list_items', ' Currency rounding rules ', { index : 4 });
            await verifyText(page, 'config', 'config_side_list_items', ' Backend discount ', { index : 5 });
            await verifyText(page, 'config', 'config_side_list_items', ' Currency freeze ', { index : 6 });
        }else{
            await verifyText(page, 'config', 'config_side_list_items', ' Exchange rates ', { index : 0 });
            await verifyText(page, 'config', 'config_side_list_items', ' Commissions ', { index : 1 });
            await verifyText(page, 'config', 'config_side_list_items', ' Tactical fare discount ', { index : 2 });
            await verifyText(page, 'config', 'config_side_list_items', ' Currency rounding rules ', { index : 3 });
            await verifyText(page, 'config', 'config_side_list_items', ' Backend discount ', { index : 4 });
            await verifyText(page, 'config', 'config_side_list_items', ' Currency freeze ', { index : 5 });
        }
        
        if(process.env.ROLE != 'analyst'){
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Actions', { index : 1, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 3 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 4 });
        }else{
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 1 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 3 });
        }

        const pricingLegend = [
        {
            tooltip: 'Your suggested action has been accepted and approved by the manager.',
            heading: 'Approved',
            icon: 'check_circle'
        },    
        {
            tooltip: 'An action has been taken and is currently under managerial review.',
            heading: 'Pending Validation',
            icon: 'hourglass_empty'
        },
        {
            tooltip: ' Deleted: This item has been deleted. ',
            heading: 'Deleted',
            icon: 'delete'
        },
        {
            tooltip: ' Declined: This item has been declined. ',
            heading: 'Declined',
            icon: 'block'
        }
        ];

        for (let index = 0; index < pricingLegend.length; index++) {
            const { tooltip, heading, icon } = pricingLegend[index];
            await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', tooltip, { index, partial: true });
            await verifyText(page, 'pricing' ,'pricing_table_legend_heading', heading, { index });
            await verifyText(page,'pricing','pricing_table_legend_icon',icon,{ index });
        }
        // Fare Execution tab is not available in UI so commented it out for now 27-07-2026
        //await actionClick(page, 'config', 'config_fareExecution_tab');
        // await page.waitForLoadState('networkidle');
        // await page.waitForTimeout(3000);
        // await verifyUrl(page, '/config/fare-execution');

        // await verifyText(page, 'config', 'config_side_list_items', ' Cabin category ladder ', { index : 0 });
        // await verifyText(page, 'config', 'config_side_list_items', ' T3/4 pricing ', { index : 1 });


        if(process.env.BRAND != 'NCL'){
            await actionClick(page, 'config', 'config_schedulePriceChanges_tab');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);
            await verifyUrl(page, '/config/scheduled-price-changes');

            await verifyText(page, 'config', 'config_side_list_items', ' Sailings ', { index : 0 });
            await verifyText(page, 'config', 'config_side_list_items', ' Lettered voyages ', { index : 1 });
        }
    });

    test('verify user is able to view different components on exchange rates [RST-2523]', async ({ page }) => {
        await page.route('**/api/catalog/currencies/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/catalog/meta-categories/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/brands/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/all-ships/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/configuration/current-exchange/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/config/currency-panes/current-exchange');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/config/currency-panes');
        await verifyText(page, 'config', 'config_page_heading', ' Config ');
        await verifyText(page, 'config', 'config_page_heading_subtext', ' Configure analyst workflows, auto-deploy logic, and fare execution settings by role and cabin category. ');
      
        await verifyText(page, 'config', 'config_heading', ' Currency Panes | ');
        await verifyText(page, 'config', 'config_sub_tab_heading', 'Exchange rates');

        
        await verifyText(page, 'config', 'config_header_text', 'Currency', { index : 0 });
        await verifyText(page, 'config', 'config_header_text', 'USD → LOCAL\nexchange rate', { index : 1 });
        await verifyText(page, 'config', 'config_header_text', 'LOCAL → USD\nexchange rate', { index : 2 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified By', { index : 3 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified Date', { index : 4 });
        await verifyText(page, 'config', 'config_header_text', 'Approved By', { index : 5 });
        await verifyText(page, 'config', 'config_header_text', 'Status', { index : 6 });

        if(process.env.ROLE != 'analyst'){
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Actions', { index : 1, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 3 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 4 });
        }else{
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 1 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 3 });
        }

        const pricingLegend = [
        {
            tooltip: 'Your suggested action has been accepted and approved by the manager.',
            heading: 'Approved',
            icon: 'check_circle'
        },    
        {
            tooltip: 'An action has been taken and is currently under managerial review.',
            heading: 'Pending Validation',
            icon: 'hourglass_empty'
        },
        {
            tooltip: ' Deleted: This item has been deleted. ',
            heading: 'Deleted',
            icon: 'delete'
        },
        {
            tooltip: ' Declined: This item has been declined. ',
            heading: 'Declined',
            icon: 'block'
        }
        ];

        for (let index = 0; index < pricingLegend.length; index++) {
            const { tooltip, heading, icon } = pricingLegend[index];
            await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', tooltip, { index, partial: true });
            await verifyText(page, 'pricing' ,'pricing_table_legend_heading', heading, { index });
            await verifyText(page,'pricing','pricing_table_legend_icon',icon,{ index });
        }
    });

    test('verify user is able to view different components on commission [RST-2524]', async ({ page }) => {
        await page.route('**/api/catalog/currencies/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/catalog/meta-categories/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/brands/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/all-ships/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/configuration/commission/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/config/currency-panes/commission');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/config/currency-panes');
        await verifyText(page, 'config', 'config_page_heading', ' Config ');
        await verifyText(page, 'config', 'config_page_heading_subtext', ' Configure analyst workflows, auto-deploy logic, and fare execution settings by role and cabin category. ');
      
        await verifyText(page, 'config', 'config_heading', ' Currency Panes | ');
        await verifyText(page, 'config', 'config_sub_tab_heading', 'Commissions');

        
        await verifyText(page, 'config', 'config_header_text', 'Currency', { index : 0 });
        await verifyText(page, 'config', 'config_header_text', 'Commission', { index : 1 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified By', { index : 2 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified Date', { index : 3 });
        await verifyText(page, 'config', 'config_header_text', 'Approved By', { index : 4 });
        await verifyText(page, 'config', 'config_header_text', 'Status', { index : 5 });

        if(process.env.ROLE != 'analyst'){
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Actions', { index : 1, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 3 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 4 });
        }else{
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 1 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 3 });
        }

        const pricingLegend = [
        {
            tooltip: 'Your suggested action has been accepted and approved by the manager.',
            heading: 'Approved',
            icon: 'check_circle'
        },    
        {
            tooltip: 'An action has been taken and is currently under managerial review.',
            heading: 'Pending Validation',
            icon: 'hourglass_empty'
        },
        {
            tooltip: ' Deleted: This item has been deleted. ',
            heading: 'Deleted',
            icon: 'delete'
        },
        {
            tooltip: ' Declined: This item has been declined. ',
            heading: 'Declined',
            icon: 'block'
        }
        ];

        for (let index = 0; index < pricingLegend.length; index++) {
            const { tooltip, heading, icon } = pricingLegend[index];
            await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', tooltip, { index, partial: true });
            await verifyText(page, 'pricing' ,'pricing_table_legend_heading', heading, { index });
            await verifyText(page,'pricing','pricing_table_legend_icon',icon,{ index });
        }
    });

    test('verify user is able to view different components on tactical fare discount [RST-2525]', async ({ page }) => {
        await page.route('**/api/catalog/currencies/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/catalog/meta-categories/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/brands/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/all-ships/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/configuration/pseudo-discount/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/config/currency-panes/pseudo-discount');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/config/currency-panes');
        await verifyText(page, 'config', 'config_page_heading', ' Config ');
        await verifyText(page, 'config', 'config_page_heading_subtext', ' Configure analyst workflows, auto-deploy logic, and fare execution settings by role and cabin category. ');
      
        await verifyText(page, 'config', 'config_heading', ' Currency Panes | ');
        await verifyText(page, 'config', 'config_sub_tab_heading', 'Tactical fare discount');

        
        await verifyText(page, 'config', 'config_header_text', 'Currency', { index : 0 });
        await verifyText(page, 'config', 'config_header_text', 'Meta Category', { index : 1 });
        await verifyText(page, 'config', 'config_header_text', 'Discount', { index : 2 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified By', { index : 3 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified Date', { index : 4 });
        await verifyText(page, 'config', 'config_header_text', 'Approved By', { index : 5 });
        await verifyText(page, 'config', 'config_header_text', 'Status', { index : 6 });

        if(process.env.ROLE != 'analyst'){
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Actions', { index : 1, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 3 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 4 });
        }else{
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 1 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 3 });
        }

        const pricingLegend = [
        {
            tooltip: 'Your suggested action has been accepted and approved by the manager.',
            heading: 'Approved',
            icon: 'check_circle'
        },    
        {
            tooltip: 'An action has been taken and is currently under managerial review.',
            heading: 'Pending Validation',
            icon: 'hourglass_empty'
        },
        {
            tooltip: ' Deleted: This item has been deleted. ',
            heading: 'Deleted',
            icon: 'delete'
        },
        {
            tooltip: ' Declined: This item has been declined. ',
            heading: 'Declined',
            icon: 'block'
        }
        ];

        for (let index = 0; index < pricingLegend.length; index++) {
            const { tooltip, heading, icon } = pricingLegend[index];
            await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', tooltip, { index, partial: true });
            await verifyText(page, 'pricing' ,'pricing_table_legend_heading', heading, { index });
            await verifyText(page,'pricing','pricing_table_legend_icon',icon,{ index });
        }
    });

    test('verify user is able to view different components on rounding rules [RST-2526]', async ({ page }) => {
        await page.route('**/api/catalog/currencies/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/catalog/meta-categories/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/brands/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/all-ships/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/configuration/rounding-rules/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/config/currency-panes/rounding-rules');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/config/currency-panes');
        await verifyText(page, 'config', 'config_page_heading', ' Config ');
        await verifyText(page, 'config', 'config_page_heading_subtext', ' Configure analyst workflows, auto-deploy logic, and fare execution settings by role and cabin category. ');
      
        await verifyText(page, 'config', 'config_heading', ' Currency Panes | ');
        await verifyText(page, 'config', 'config_sub_tab_heading', 'Currency rounding rules');

        
        await verifyText(page, 'config', 'config_header_text', 'Currency', { index : 0 });
        await verifyText(page, 'config', 'config_header_text', 'Prices Ends In', { index : 1 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified By', { index : 2 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified Date', { index : 3 });
        await verifyText(page, 'config', 'config_header_text', 'Approved By', { index : 4 });
        await verifyText(page, 'config', 'config_header_text', 'Status', { index : 5 });

        if(process.env.ROLE != 'analyst'){
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Actions', { index : 1, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 3 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 4 });
        }else{
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 1 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 3 });
        }

        const pricingLegend = [
        {
            tooltip: 'Your suggested action has been accepted and approved by the manager.',
            heading: 'Approved',
            icon: 'check_circle'
        },    
        {
            tooltip: 'An action has been taken and is currently under managerial review.',
            heading: 'Pending Validation',
            icon: 'hourglass_empty'
        },
        {
            tooltip: ' Deleted: This item has been deleted. ',
            heading: 'Deleted',
            icon: 'delete'
        },
        {
            tooltip: ' Declined: This item has been declined. ',
            heading: 'Declined',
            icon: 'block'
        }
        ];

        for (let index = 0; index < pricingLegend.length; index++) {
            const { tooltip, heading, icon } = pricingLegend[index];
            await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', tooltip, { index, partial: true });
            await verifyText(page, 'pricing' ,'pricing_table_legend_heading', heading, { index });
            await verifyText(page,'pricing','pricing_table_legend_icon',icon,{ index });
        }
    });

    test('verify user is able to view different components on backend discounts [RST-2527]', async ({ page }) => {
        await page.route('**/api/catalog/currencies/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/catalog/meta-categories/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/brands/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/all-ships/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/configuration/currency-conversion/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/config/currency-panes/currency-conversion');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/config/currency-panes');
        await verifyText(page, 'config', 'config_page_heading', ' Config ');
        await verifyText(page, 'config', 'config_page_heading_subtext', ' Configure analyst workflows, auto-deploy logic, and fare execution settings by role and cabin category. ');
      
        await verifyText(page, 'config', 'config_heading', ' Currency Panes | ');
        await verifyText(page, 'config', 'config_sub_tab_heading', 'Backend discount');

        
        await verifyText(page, 'config', 'config_header_text', 'Currency', { index : 0 });
        await verifyText(page, 'config', 'config_header_text', 'Ship', { index : 1 });
        await verifyText(page, 'config', 'config_header_text', 'Meta Category', { index : 2 });
        await verifyText(page, 'config', 'config_header_text', 'Departure\nDate From', { index : 3 });
        await verifyText(page, 'config', 'config_header_text', 'Departure\nDate To', { index : 4 });
        await verifyText(page, 'config', 'config_header_text', 'Effective\nUntil', { index : 5 });
        await verifyText(page, 'config', 'config_header_text', 'Daily\nPromo Cost', { index : 6 });
        await verifyText(page, 'config', 'config_header_text', 'Flat\nPromo Cost', { index : 7 });
        await verifyText(page, 'config', 'config_header_text', 'Daily Adj', { index : 8 });
        await verifyText(page, 'config', 'config_header_text', 'Flat Adj', { index : 9 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified By', { index : 10 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified Date', { index : 11 });
        await verifyText(page, 'config', 'config_header_text', 'Approved By', { index : 12 });
        await verifyText(page, 'config', 'config_header_text', 'Status', { index : 13 });

        if(process.env.ROLE != 'analyst'){
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Actions', { index : 1, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 3 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 4 });
        }else{
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 1 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 3 });
        }

        const pricingLegend = [
        {
            tooltip: 'Your suggested action has been accepted and approved by the manager.',
            heading: 'Approved',
            icon: 'check_circle'
        },    
        {
            tooltip: 'An action has been taken and is currently under managerial review.',
            heading: 'Pending Validation',
            icon: 'hourglass_empty'
        },
        {
            tooltip: ' Deleted: This item has been deleted. ',
            heading: 'Deleted',
            icon: 'delete'
        },
        {
            tooltip: ' Declined: This item has been declined. ',
            heading: 'Declined',
            icon: 'block'
        }
        ];

        for (let index = 0; index < pricingLegend.length; index++) {
            const { tooltip, heading, icon } = pricingLegend[index];
            await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', tooltip, { index, partial: true });
            await verifyText(page, 'pricing' ,'pricing_table_legend_heading', heading, { index });
            await verifyText(page,'pricing','pricing_table_legend_icon',icon,{ index });
        }
    });

    test('verify user is able to view different components on currency freeze [RST-2528]', async ({ page }) => {
        await page.route('**/api/catalog/currencies/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/catalog/meta-categories/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/brands/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/all-ships/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/configuration/currency-sailing-freeze/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/config/currency-panes/currency-sailing-freeze');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/config/currency-panes');
        await verifyText(page, 'config', 'config_page_heading', ' Config ');
        await verifyText(page, 'config', 'config_page_heading_subtext', ' Configure analyst workflows, auto-deploy logic, and fare execution settings by role and cabin category. ');
      
        await verifyText(page, 'config', 'config_heading', ' Currency Panes | ');
        await verifyText(page, 'config', 'config_sub_tab_heading', 'Currency freeze');

        
        await verifyText(page, 'config', 'config_header_text', 'Currency', { index : 0 });
        await verifyText(page, 'config', 'config_header_text', 'Ship', { index : 1 });
        await verifyText(page, 'config', 'config_header_text', 'Departure\nDate From', { index : 2 });
        await verifyText(page, 'config', 'config_header_text', 'Departure\nDate To', { index : 3 });
        await verifyText(page, 'config', 'config_header_text', 'Effective\nUntil', { index : 4 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified By', { index : 5 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified Date', { index : 6 });
        await verifyText(page, 'config', 'config_header_text', 'Approved By', { index : 7 });
        await verifyText(page, 'config', 'config_header_text', 'Status', { index : 8 });

        if(process.env.ROLE != 'analyst'){
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Actions', { index : 1, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 3 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 4 });
        }else{
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 1 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 3 });
        }

        const pricingLegend = [
        {
            tooltip: 'Your suggested action has been accepted and approved by the manager.',
            heading: 'Approved',
            icon: 'check_circle'
        },    
        {
            tooltip: 'An action has been taken and is currently under managerial review.',
            heading: 'Pending Validation',
            icon: 'hourglass_empty'
        },
        {
            tooltip: ' Deleted: This item has been deleted. ',
            heading: 'Deleted',
            icon: 'delete'
        },
        {
            tooltip: ' Declined: This item has been declined. ',
            heading: 'Declined',
            icon: 'block'
        }
        ];

        for (let index = 0; index < pricingLegend.length; index++) {
            const { tooltip, heading, icon } = pricingLegend[index];
            await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', tooltip, { index, partial: true });
            await verifyText(page, 'pricing' ,'pricing_table_legend_heading', heading, { index });
            await verifyText(page,'pricing','pricing_table_legend_icon',icon,{ index });
        }
    });

    test('verify user is able to view different components on cabin category ladder [RST-2530]', async ({ page }) => {
        await page.route('**/api/catalog/currencies/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/catalog/meta-categories/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/brands/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/all-ships/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/configuration/cabin-category-ladder/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/config/fare-execution/cabin-category-ladder');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/config/fare-execution');
        await verifyText(page, 'config', 'config_page_heading', ' Config ');
        await verifyText(page, 'config', 'config_page_heading_subtext', ' Configure analyst workflows, auto-deploy logic, and fare execution settings by role and cabin category. ');
      
        await verifyText(page, 'config', 'config_heading', ' Fare execution | ');
        await verifyText(page, 'config', 'config_sub_tab_heading', 'Cabin category ladder');

        
        await verifyText(page, 'config', 'config_header_text', 'Region', { index : 0 });
        await verifyText(page, 'config', 'config_header_text', 'Ship', { index : 1 });
        await verifyText(page, 'config', 'config_header_text', 'Meta', { index : 2 });
        await verifyText(page, 'config', 'config_header_text', 'Cabin category', { index : 3 });
        await verifyText(page, 'config', 'config_header_text', 'Low RMS multiplier', { index : 4 });
        await verifyText(page, 'config', 'config_header_text', 'Default RMS multiplier', { index : 5 });
        await verifyText(page, 'config', 'config_header_text', 'High RMS multiplier', { index : 6 });
    });

    test('verify user is able to view different components on t3/4 pricing [RST-2531]', async ({ page }) => {
        await page.route('**/api/catalog/currencies/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/catalog/meta-categories/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/brands/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/all-ships/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/configuration/t3-4-pricing/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/config/fare-execution/t3-4-pricing');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/config/fare-execution');
        await verifyText(page, 'config', 'config_page_heading', ' Config ');
        await verifyText(page, 'config', 'config_page_heading_subtext', ' Configure analyst workflows, auto-deploy logic, and fare execution settings by role and cabin category. ');
      
        await verifyText(page, 'config', 'config_heading', ' Fare execution | ');
        await verifyText(page, 'config', 'config_sub_tab_heading', 'T3/4 pricing');

        
        await verifyText(page, 'config', 'config_header_text', 'Region', { index : 0 });
        await verifyText(page, 'config', 'config_header_text', 'Ship', { index : 1 });
        await verifyText(page, 'config', 'config_header_text', 'Meta', { index : 2 });
        await verifyText(page, 'config', 'config_header_text', 'Low T4 multiplier', { index : 3 });
        await verifyText(page, 'config', 'config_header_text', 'Default T4 multiplier', { index : 4 });
        await verifyText(page, 'config', 'config_header_text', 'High T4 multiplier', { index : 5 });
        await verifyText(page, 'config', 'config_header_text', 'Low single multiplier', { index : 6 });
        await verifyText(page, 'config', 'config_header_text', 'Default Single multiplier', { index : 7 });
        await verifyText(page, 'config', 'config_header_text', 'High single multiplier', { index : 8 });
    });
})


test.describe(' Config page for O&R @regression @OCEANIA-admin @REGENT-admin @OCEANIA-manager @REGENT-manager @OCEANIA-analyst @REGENT-analyst', () => {
    test('verify user is able to view different components on currency exchange overrides [RST-2529]', async ({ page }) => {
        await page.route('**/api/catalog/currencies/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/catalog/meta-categories/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/brands/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/all-ships/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/configuration/currency-exchange-overrides/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/config/currency-panes/currency-exchange-overrides');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/config/currency-panes');
        await verifyText(page, 'config', 'config_page_heading', ' Config ');
        await verifyText(page, 'config', 'config_page_heading_subtext', ' Configure analyst workflows, auto-deploy logic, and fare execution settings by role and cabin category. ');
      
        await verifyText(page, 'config', 'config_heading', ' Currency Panes | ');
        await verifyText(page, 'config', 'config_sub_tab_heading', 'Currency exchange overrides');

        
        await verifyText(page, 'config', 'config_header_text', 'Currency', { index : 0 });
        await verifyText(page, 'config', 'config_header_text', 'Departure\nDate From', { index : 1 });
        await verifyText(page, 'config', 'config_header_text', 'Departure\nDate To', { index : 2 });
        await verifyText(page, 'config', 'config_header_text', 'Ship', { index : 3 });
        await verifyText(page, 'config', 'config_header_text', 'Current USD → LOCAL \nExchange Rate', { index : 4 });
        await verifyText(page, 'config', 'config_header_text', 'USD → LOCAL \nExchange Rate', { index : 5 });
        await verifyText(page, 'config', 'config_header_text', 'LOCAL → USD \nExchange Rate', { index : 6 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified By', { index : 7 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified Date', { index : 8 });
        await verifyText(page, 'config', 'config_header_text', 'Status', { index : 9 });

        if(process.env.ROLE != 'analyst'){
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Actions', { index : 1, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 3 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 4 });
        }else{
            await verifyText(page, 'config', 'config_buttons', 'Add parameters', { index : 0, partial : true });
            await verifyText(page, 'config', 'config_buttons', 'Reset', { index : 1 });
            await verifyText(page, 'config', 'config_buttons', 'Delete row', { index : 2 });
            await verifyText(page, 'config', 'config_buttons', 'Save changes', { index : 3 });
        }

        const pricingLegend = [
        {
            tooltip: 'Your suggested action has been accepted and approved by the manager.',
            heading: 'Approved',
            icon: 'check_circle'
        },    
        {
            tooltip: 'An action has been taken and is currently under managerial review.',
            heading: 'Pending Validation',
            icon: 'hourglass_empty'
        },
        {
            tooltip: ' Deleted: This item has been deleted. ',
            heading: 'Deleted',
            icon: 'delete'
        },
        {
            tooltip: ' Declined: This item has been declined. ',
            heading: 'Declined',
            icon: 'block'
        }
        ];

        for (let index = 0; index < pricingLegend.length; index++) {
            const { tooltip, heading, icon } = pricingLegend[index];
            await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', tooltip, { index, partial: true });
            await verifyText(page, 'pricing' ,'pricing_table_legend_heading', heading, { index });
            await verifyText(page,'pricing','pricing_table_legend_icon',icon,{ index });
        }
    });

    test('verify user is able to view different components on Sailings [RST-2532]', async ({ page }) => {
        await page.route('**/api/catalog/currencies/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/catalog/meta-categories/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/brands/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/all-ships/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/configuration/scheduled-price-changes/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/config/scheduled-price-changes/sailings');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/config/scheduled-price-changes');
        await verifyText(page, 'config', 'config_page_heading', ' Config ');
        await verifyText(page, 'config', 'config_page_heading_subtext', ' Configure analyst workflows, auto-deploy logic, and fare execution settings by role and cabin category. ');
      
        await verifyText(page, 'config', 'config_heading', ' Config | ');
        await verifyText(page, 'config', 'config_sub_tab_heading', 'Sailings');

        await verifyText(page, 'config', 'config_header_text', 'Voyage Code', { index : 0 });
        await verifyText(page, 'config', 'config_header_text', 'Ship', { index : 1 });
        await verifyText(page, 'config', 'config_header_text', 'Sail Date', { index : 2 });
        await verifyText(page, 'config', 'config_header_text', 'Meta Category', { index : 3 });
        await verifyText(page, 'config', 'config_header_text', 'Current Price', { index : 4 });
        await verifyText(page, 'config', 'config_header_text', 'Future Price', { index : 5 });
        await verifyText(page, 'config', 'config_header_text', 'Effective Date', { index : 6 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified By', { index : 7 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified Date', { index : 8 });
        await verifyText(page, 'config', 'config_header_text', 'Approved By', { index : 9 });
        await verifyText(page, 'config', 'config_header_text', 'Status', { index : 10 });
    });

    test('verify user is able to view different components on lettered voyages [RST-2533]', async ({ page }) => {
        await page.route('**/api/catalog/currencies/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/catalog/meta-categories/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/brands/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/catalog/all-ships/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/configuration/lettered-voyages-scheduled-changes/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/config/scheduled-price-changes/lettered-voyages');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/config/scheduled-price-changes');
        await verifyText(page, 'config', 'config_page_heading', ' Config ');
        await verifyText(page, 'config', 'config_page_heading_subtext', ' Configure analyst workflows, auto-deploy logic, and fare execution settings by role and cabin category. ');
      
        await verifyText(page, 'config', 'config_heading', ' Config | ');
        await verifyText(page, 'config', 'config_sub_tab_heading', 'Lettered voyages');

        await verifyText(page, 'config', 'config_header_text', 'Lettered Voyage Code', { index : 0 });
        await verifyText(page, 'config', 'config_header_text', 'Sailing Segments', { index : 1 });
        await verifyText(page, 'config', 'config_header_text', 'Sail Date', { index : 2 });
        await verifyText(page, 'config', 'config_header_text', 'Meta Category', { index : 3 });
        await verifyText(page, 'config', 'config_header_text', 'Cabin Category', { index : 4 });
        await verifyText(page, 'config', 'config_header_text', 'Override Type', { index : 5 });
        await verifyText(page, 'config', 'config_header_text', 'Current Price', { index : 6 });
        await verifyText(page, 'config', 'config_header_text', 'Segment Calculated Price Sum', { index : 7 });
        await verifyText(page, 'config', 'config_header_text', 'Future Segment Calculated Price Sum', { index : 8 });
        await verifyText(page, 'config', 'config_header_text', 'Effective Date', { index : 9 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified By', { index : 10 });
        await verifyText(page, 'config', 'config_header_text', 'Last Modified Date', { index : 11 });
        await verifyText(page, 'config', 'config_header_text', 'Status', { index : 12 });
    });
})
