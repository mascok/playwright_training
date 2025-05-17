import { test } from '@playwright/test'
import { loginController } from '../../controller/login/login.controller';
import { variable } from '../../../resources/variables/index';
import { loginUseCases } from '../../reusablecase/login.usecase';
import { sharedController } from '../../controller/shared/shared.controller';

// test.describe.configure({ mode : 'parallel' })

test.describe('Login saucelab', () => {
    let LoginController: loginController;
    let LoginUseCases: loginUseCases;
    let SharedController: sharedController;

    test.beforeEach(async ({ page }) => {
        LoginController = new loginController(page);
        LoginUseCases = new loginUseCases(page);
        SharedController = new sharedController(page);
        await SharedController.accessUrl('https://www.saucedemo.com/v1/');
    });

    test("login incorrect",{tag: '@error'}, async () => {
        await LoginController.inputUsername("standard_sauces");
        await LoginController.inputPassword(variable.password);
        await LoginController.clickLoginButton();
        await LoginController.verifyErrorMessage(/Username and password do not match any user in this service/)
        await SharedController.visualRegression('not_match.png')
    })

    test("login with empty username",{tag: ['@error', '@empty']}, async () => {
        await LoginController.inputPassword(variable.password);
        await LoginController.clickLoginButton();

        await LoginController.verifyErrorMessage(/Username is required/)
        await SharedController.visualRegression('username_required.png')

    })

    test("login with empty password",{tag: ['@error','@empty']}, async () => {
        await LoginController.inputUsername(variable.username);
        await LoginController.clickLoginButton();

        await LoginController.verifyErrorMessage(/Password is required/)
        await SharedController.visualRegression('password_required.png')
    })

    test.skip("login with no internet connection",{tag: ['@error', '@network']}, async ({page}) => {
        await LoginController.inputUsername(variable.username);
        await LoginController.inputPassword(variable.password);
        await LoginController.clickLoginButton();
        await page.context().setOffline(true);

        try {
            await page.reload();
          } catch (error) {
            console.log('Reload failed as expected due to offline mode.');
          }
          
        await LoginController.headerNotVisible();
        await page.context().setOffline(false);
        await page.reload();
        await LoginController.headerVisible();
    })

    test("login success",{tag: '@success'}, async () => {
        await LoginUseCases.login_success(variable.username,variable.password);
        await SharedController.visualRegression('success.png')
    })
})