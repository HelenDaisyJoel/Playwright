const admin = {
    admin_heading_subtext: '.mb-5 .leading-5',
    admin_user_tab: '[data-testid="action-tabs-container"] [data-test-id="users-tab"]',
    admin_portfolio_tab: '[data-testid="action-tabs-container"] [data-test-id="portfolio-tab"]',

    admin_user_header: 'app-user-management [data-testid="meta-title"]',
    admin_user_subheader: 'app-user-management [data-testid="sub-tab-title"]',
    admin_user_subtext: 'app-user-management [data-testid="tab-description"]',
    
    admin_user_search: 'app-user-management  [placeholder="Search"]',

    admin_user_table_name: 'app-user-management [col-id="name"] .ag-header-cell-text',
    admin_user_table_username: 'app-user-management [col-id="username"] .ag-header-cell-text',
    admin_user_table_brand: 'app-user-management [col-id="brand"] .ag-header-cell-text',
    admin_user_table_role: 'app-user-management [col-id="roles"] .ag-header-cell-text',
    admin_user_table_reports_to: 'app-user-management [col-id="reports_to"] .ag-header-cell-text',

    admin_user_rows: 'app-user-management .ag-viewport [role="row"]',


    admin_portfolio_header: 'app-portfolio-management [data-testid="meta-title"]',
    admin_portfolio_subheader: 'app-portfolio-management [data-testid="sub-tab-title"]',
    admin_portfolio_subtext: 'app-portfolio-management [data-testid="tab-description"]',
    
    admin_portfolio_search: 'app-portfolio-management  [placeholder="Search"]',
    
    admin_portfolio_table_name: 'app-portfolio-management [col-id="ag-Grid-AutoColumn"] .ag-header-cell-text',
    admin_portfolio_table_role: 'app-portfolio-management [col-id="roles"] .ag-header-cell-text',
    admin_portfolio_table_brand: 'app-portfolio-management [col-id="brand"] .ag-header-cell-text',
    admin_portfolio_table_total_ships: 'app-portfolio-management [col-id="total_ships"] .ag-header-cell-text',
    admin_portfolio_table_ships_voyages: 'app-portfolio-management [col-id="ships_voyages"] .ag-header-cell-text',
    admin_portfolio_table_reports_to: 'app-portfolio-management [col-id="reports_to"] .ag-header-cell-text',
    admin_portfolio_table_actions: 'app-portfolio-management [col-id="actions"] .ag-header-cell-text',

    admin_portfolio_rows: 'app-portfolio-management .ag-viewport [role="row"]',
  } as const;

export default admin;
