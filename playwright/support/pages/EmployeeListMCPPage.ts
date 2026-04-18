import { Locator, Page } from '@playwright/test';

export default class EmployeeListMCPPage {
    private readonly page: Page;
    private readonly employeeNameInput: Locator;
    private readonly employeeIdInput: Locator;
    private readonly jobTitleSelect: Locator;
    private readonly searchButton: Locator;
    private readonly resetButton: Locator;
    private readonly recordsFound: Locator;
    private readonly tableRows: Locator;
    private readonly pageHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        const employeeNameGroup = page.locator('.oxd-input-group').filter({
            has: page.getByText('Employee Name', { exact: true })
        });
        this.employeeNameInput = employeeNameGroup.getByPlaceholder('Type for hints...');

        const employeeIdGroup = page.locator('.oxd-input-group').filter({
            has: page.getByText('Employee Id', { exact: true })
        });
        this.employeeIdInput = employeeIdGroup.getByRole('textbox');

        const jobTitleGroup = page.locator('.oxd-input-group').filter({
            has: page.getByText('Job Title', { exact: true })
        });
        this.jobTitleSelect = jobTitleGroup.locator('.oxd-select-text');

        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.recordsFound = page.locator('.orangehrm-horizontal-padding .oxd-text--span');
        this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
        this.pageHeading = page.getByRole('heading', { name: 'PIM', level: 6 });
    }

    async navigate(): Promise<void> {
        await this.page.goto('/web/index.php/pim/viewEmployeeList');
    }

    async searchByEmployeeName(hint: string, suggestion: string): Promise<void> {
        await this.employeeNameInput.fill(hint);
        await this.page.getByRole('option', { name: suggestion }).click();
    }

    async fillEmployeeId(id: string): Promise<void> {
        await this.employeeIdInput.fill(id);
    }

    async selectJobTitle(title: string): Promise<void> {
        await this.jobTitleSelect.click();
        await this.page.getByRole('option', { name: title, exact: true }).click();
    }

    async clickSearch(): Promise<void> {
        await this.searchButton.click();
    }

    async clickReset(): Promise<void> {
        await this.resetButton.click();
    }

    getRecordsFound(): Locator {
        return this.recordsFound;
    }

    getTableRows(): Locator {
        return this.tableRows;
    }

    getEmployeeNameInput(): Locator {
        return this.employeeNameInput;
    }

    getEmployeeIdInput(): Locator {
        return this.employeeIdInput;
    }

    getJobTitleSelect(): Locator {
        return this.jobTitleSelect;
    }

    getPageHeading(): Locator {
        return this.pageHeading;
    }

    getSearchButton(): Locator {
        return this.searchButton;
    }

    getResetButton(): Locator {
        return this.resetButton;
    }
}
