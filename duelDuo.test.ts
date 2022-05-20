
import { Builder, Capabilities, By } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
    driver.get('http://localhost:3000/')
})

afterAll(async () => {
    driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
})

test('Draw button draws robots', async () => {
    await driver.findElement(By.xpath(`//button[text()='Draw']`)).click();
    const bots = await driver.findElements(By.xpath(`//section/div[1]`))
    expect(bots).toBeTruthy()
})

test('Add Duo button adds bot to duo', async () => {
    await driver.findElement(By.xpath(`//section/div[1]/div/button[@class='bot-btn']`)).click()
    const duo = await driver.findElement(By.xpath(`//section[2]/div/div`))
    expect(duo).toBeTruthy()
})