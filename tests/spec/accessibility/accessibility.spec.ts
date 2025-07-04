import test, { expect } from "playwright/test";
import { sharedController } from "../../controller/shared/shared.controller";
import { AxeBuilder } from '@axe-core/playwright';
import { AccessibilityImpact } from "../../../enum/impact.enum";

let SharedController: sharedController;

test.describe('Accessibility Test', () => {
    test.beforeEach(async ({ page }) => {
        SharedController = new sharedController(page);
        await SharedController.accessUrl('https://commitquality.com/practice-api');
    })

    test('Check Accessibility Entire Page', async ({ page }, testInfo) => {
        const results = await new AxeBuilder({ page }).analyze();

        await SharedController.accessibilityErrorCheck(results, testInfo);
        await SharedController.accessibilityCheckByStatus(results, AccessibilityImpact.minor, 5);
        await SharedController.accessibilityCheckByStatus(results, AccessibilityImpact.moderate, 4);
        await SharedController.accessibilityCheckByStatus(results, AccessibilityImpact.critical, 3);
        await SharedController.accessibilityCheckByStatus(results, AccessibilityImpact.serious, 2);
    })

    test.only('Check Accessibility on Element', async ({ page }, testInfo) => {
        const results = await new AxeBuilder({ page })
        // .include('.back-link')
        .analyze();

        await testInfo.attach('accessibility report', {
            body: JSON.stringify(results, null, 2),
            contentType: 'application/json',
        })

        expect(results.violations).toEqual([]);
    })

    test('Check Accessibility exclude Element', async ({ page }) => {
        const results = await new AxeBuilder({ page })
        .exclude('a.back-link')
        .analyze();

        expect(results.violations).toEqual([]);
    })

    test('Check Accessibility with tags', async ({ page }) => {
        const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

        expect(results.violations).toEqual([]);
    })

    test('Check Accessibility with disable rules', async ({ page }, testInfo) => {
        const results = await new AxeBuilder({ page })
        .disableRules(["landmark-one-main","page-has-heading-one","region"])
        .analyze();

        expect(results.violations).toEqual([]);

        await testInfo.attach('accessibility report', {
            body: JSON.stringify(results, null, 2),
            contentType: 'application/json',
        })
    })

    test('Check Accessibility on spesific rule', async ({ page }) => {
        const results = await new AxeBuilder({ page })
        .withRules(["region"])
        .analyze();

        expect(results.violations).toEqual([]);
    })
    
    
})
