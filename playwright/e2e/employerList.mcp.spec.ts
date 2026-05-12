import { test, expect } from '../setup/fixtures';
import { user } from '../support/user/user';

test.describe('Lista de Empregados (MCP) - Cenários autenticados', () => {
    test.beforeEach(async ({ loginPage, employeeListMCPPage }) => {
        await loginPage.login(user.name, user.password);
        await employeeListMCPPage.navigate();

        await expect(employeeListMCPPage.getPageHeading()).toBeVisible();
        await expect(employeeListMCPPage.getSearchButton()).toBeEnabled();
    });

    test('CT01 - Deve pesquisar empregado pelo nome e exibir apenas os registros correspondentes', async ({ employeeListMCPPage }) => {
        await employeeListMCPPage.searchByEmployeeName('John', 'john michael doe');
        await employeeListMCPPage.clickSearch();

        await expect(employeeListMCPPage.getRecordsFound()).toContainText('(1) Record Found');
        await expect(employeeListMCPPage.getTableRows()).toHaveCount(1);
        await expect(employeeListMCPPage.getTableRows().first()).toContainText('John MichaelDoe');
    });

    test('CT02 - Deve exibir todos os empregados ao pesquisar com campos em branco', async ({ employeeListMCPPage }) => {
        await expect(employeeListMCPPage.getEmployeeNameInput()).toHaveValue('');
        await expect(employeeListMCPPage.getEmployeeIdInput()).toHaveValue('');

        await employeeListMCPPage.clickSearch();

        await expect(employeeListMCPPage.getRecordsFound()).toContainText('Records Found');
        await expect(employeeListMCPPage.getTableRows().first()).toBeVisible();
    });

    test('CT03 - Deve pesquisar empregado pelo Employee Id e retornar o registro correspondente', async ({ employeeListMCPPage }) => {
        await employeeListMCPPage.fillEmployeeId('0391');
        await employeeListMCPPage.clickSearch();

        await expect(employeeListMCPPage.getRecordsFound()).toContainText('(1) Record Found');
        await expect(employeeListMCPPage.getTableRows()).toHaveCount(1);
        await expect(employeeListMCPPage.getTableRows().first()).toContainText('0391');
    });

    test('CT04 - Deve filtrar empregados pelo Job Title selecionado', async ({ employeeListMCPPage }) => {
        await employeeListMCPPage.selectJobTitle('HR Manager');
        await expect(employeeListMCPPage.getJobTitleSelect()).toContainText('HR Manager');

        await employeeListMCPPage.clickSearch();

        await expect(employeeListMCPPage.getRecordsFound()).toContainText('(1) Record Found');
        await expect(employeeListMCPPage.getTableRows()).toHaveCount(1);
        await expect(employeeListMCPPage.getTableRows().first()).toContainText('HR Manager');
    });

    test('CT05 - Deve limpar os campos e retornar a listagem inicial ao clicar em Reset', async ({ employeeListMCPPage }) => {
        await employeeListMCPPage.fillEmployeeId('0391');
        await expect(employeeListMCPPage.getEmployeeIdInput()).toHaveValue('0391');

        await employeeListMCPPage.clickReset();

        await expect(employeeListMCPPage.getEmployeeIdInput()).toHaveValue('');
        await expect(employeeListMCPPage.getEmployeeNameInput()).toHaveValue('');
        await expect(employeeListMCPPage.getJobTitleSelect()).toContainText('-- Select --');
        await expect(employeeListMCPPage.getRecordsFound()).toContainText('Records Found');
    });
});

test.describe('Lista de Empregados (MCP) - Acesso não autenticado', () => {
    test('CT06 - Deve redirecionar para a tela de login ao tentar acessar a Lista de Empregados sem autenticação', async ({ page }) => {
        await page.goto('/web/index.php/pim/viewEmployeeList');

        await expect(page).toHaveURL(/\/web\/index\.php\/auth\/login/);
        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });
});
