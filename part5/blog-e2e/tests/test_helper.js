const createNewBlog = async (page, { title, author, url }) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    const boxes = await page.getByRole('textbox').all()
    await boxes[0].fill(title)
    await boxes[1].fill(author)
    await boxes[2].fill(url)
    await page.getByRole('button', { name: 'create' }).click()
}
const likeTo = async (locator, times) => {
    await locator.getByRole('button', { name: 'view' }).click()

    for (let i = 0; i < times; i++) {
        await locator.getByRole('button', { name: 'like' }).click()
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
    await locator.getByRole('button', { name: 'hide' }).click()
}

module.exports = { createNewBlog, likeTo }