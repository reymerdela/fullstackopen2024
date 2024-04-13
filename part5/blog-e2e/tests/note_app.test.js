const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createNewBlog, likeTo } = require('./test_helper')

describe('Note app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http:localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Test User',
                username: 'reymer',
                password: '123456'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const loginButton = await page.getByRole('button', { name: 'login' })
        await expect(loginButton).toBeVisible()
        const boxes = await page.getByRole('textbox').all()
        await expect(boxes[0]).toBeVisible()
        await expect(boxes[1]).toBeVisible()
    })


    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            const boxes = await page.getByRole('textbox').all()
            await boxes[0].fill('mluukkai')
            await boxes[1].fill('salainen')
            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByText('mluukkai logged in')).toBeVisible()
        });

        test('fails with wrong credentials', async ({ page }) => {
            const boxes = await page.getByRole('textbox').all()
            await boxes[0].fill('mluukkai')
            await boxes[1].fill('falsePass')
            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByText('invalid username or password')).toBeVisible()
            await expect(boxes[0]).toBeVisible()
            await expect(boxes[1]).toBeVisible()
            await expect(page.getByText('mluukkai logged in')).not.toBeVisible()
        });
    });


    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            const boxes = await page.getByRole('textbox').all()
            await boxes[0].fill('mluukkai')
            await boxes[1].fill('salainen')
            await page.getByRole('button', { name: 'login' }).click()
        });

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()
            const boxes = await page.getByRole('textbox').all()
            await boxes[0].fill('test note')
            await boxes[1].fill('mlukkai')
            await boxes[2].fill('www.fullstackopen.com')
            await page.getByRole('button', { name: 'create' }).click()

            await expect(page.getByText('a new blog test note by mlukkai added')).toBeVisible()
        });

        describe('an serveral blogs existed', () => {

            test('a user can delete the blog', async ({ page }) => {
                await createNewBlog(page, { title: 'blog for test', author: 'reymer', url: 'testing.com' })
                const note = await page.getByText('blog for test')
                await note.getByRole('button', { name: 'view' }).click()
                const dialogEvent = page.waitForEvent('dialog')
                page.on('dialog', async dialog => {
                    await dialog.accept()
                })
                await page.getByRole('button', { name: 'delete' }).click()
                await dialogEvent
                await expect(page.getByText('blog for test reymer',)).not.toBeVisible()
            });

            test('Only the user who created the blog can delete it', async ({ page }) => {
                await createNewBlog(page, { title: 'blog for test', author: 'reymer', url: 'testing.com' })
                await page.getByText('blog for test').getByRole('button', { name: 'view' }).click()
                await expect(page.getByText('delete')).toBeVisible()
                await page.getByRole('button', { name: 'logout' }).click()
                const boxes = await page.getByRole('textbox').all()
                await boxes[0].fill('reymer')
                await boxes[1].fill('123456')
                await page.getByRole('button', { name: 'login' }).click()
                await page.getByText('blog for test').getByRole('button', { name: 'view' }).click()
                await expect(page.getByText('delete')).not.toBeVisible()
            });

            test('blogs are ordered in order acording to the likes', async ({ page }) => {
                await createNewBlog(page, { title: 'blog test 1', author: 'root', url: 'testing.com' })
                await createNewBlog(page, { title: 'blog test 2', author: 'root', url: 'testing.com' })
                await createNewBlog(page, { title: 'blog test 3', author: 'root', url: 'testing.com' })
                const blog1 = await page.locator('.Blog').filter({ hasText: 'blog test 1' })
                const blog2 = await page.locator('.Blog').filter({ hasText: 'blog test 2' })
                const blog3 = await page.locator('.Blog').filter({ hasText: 'blog test 3' })
                await likeTo(blog3, 3)
                await likeTo(blog2, 2)
                await likeTo(blog1, 1)
                const blogs = await page.locator('.Blog').all()
                await expect(blogs[0]).toContainText('blog test 3')
                await expect(blogs[1]).toContainText('blog test 2')
                await expect(blogs[2]).toContainText('blog test 1')
            })
        });


    });
})