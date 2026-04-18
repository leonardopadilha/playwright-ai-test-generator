import { test as base, expect } from '@playwright/test';
import LoginPage from '../support/pages/LoginPage';
import DashboardPage from '../support/pages/dashboardPage'
import EmployeeListMCPPage from '../support/pages/EmployeeListMCPPage';

const test = base.extend<{ 
    loginPage: LoginPage,
    dashboardPage: DashboardPage,
    employeeListMCPPage: EmployeeListMCPPage
}>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page)
        await loginPage.navigateTo('/web/index.php/auth/login')
        await use(loginPage)
    },
    dashboardPage: async ({ page }, use) => {
        const dashboardPage = new DashboardPage(page)
        await use(dashboardPage)
    },
    employeeListMCPPage: async ({ page }, use) => {
        const employeeListMCPPage = new EmployeeListMCPPage(page)
        await use(employeeListMCPPage)
    }
})

export { test, expect}
