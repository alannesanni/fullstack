describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testi Testinen',
      username: 'testi',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    const user2 = {
      name: 'Uusi Uusinen',
      username: 'uusi',
      password: 'sala'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('')

  })
  it('Login form is shown', function() {
    cy.visit('')
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Testi Testinen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'testi', password: 'salainen'
      }).then(response => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:5173')
      })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#newtitle').type('New Things')
      cy.get('#newauthor').type('Cypress')
      cy.get('#newurl').type('ww.testi.fi')
      cy.contains('create').click()
      cy.contains('New blog New Things by Cypress added')
      cy.contains('New Things')
    })
    describe('When new blog is added', function() {
      beforeEach(function() {
        cy.contains('new blog').click()
        cy.get('#newtitle').type('New Things')
        cy.get('#newauthor').type('Cypress')
        cy.get('#newurl').type('ww.testi.fi')
        cy.contains('create').click()
      })

      it('A blog can be liked', function() {
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('A blog can be removed', function() {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.contains('www.testi.fi').should('not.exist')
      })

      it('Remove button is only visible to the user that created the blog', function() {
        cy.contains('logout').click()
        cy.get('#username').type('uusi')
        cy.get('#password').type('sala')
        cy.get('#login-button').click()
        cy.contains('view').click()
        cy.contains('remove').should('not.exist')
      })

      it('Blogs are in right order by likes', function() {
        cy.contains('new blog').click()
        cy.get('#newtitle').type('Most Likes')
        cy.get('#newauthor').type('Cypress')
        cy.get('#newurl').type('ww.testi.fi')
        cy.contains('create').click()

        cy.contains('new blog').click()
        cy.get('#newtitle').type('Least Likes')
        cy.get('#newauthor').type('Cypress')
        cy.get('#newurl').type('ww.testi.fi')
        cy.contains('create').click()

        cy.contains('New Things').contains('view').click()
        cy.contains('Most Likes').contains('view').click()
        cy.contains('Least Likes').contains('view').click()
        cy.get('.New').eq(0).contains('like').click()
        cy.get('.New').eq(0).contains('like').click()
        cy.get('.Most').eq(0).contains('like').click()
        cy.get('.Most').eq(0).contains('like').click()
        cy.get('.Most').eq(0).contains('like').click()
        cy.get('.blog').eq(0).should('contain', 'Most Likes')
        cy.get('.blog').eq(1).should('contain', 'New Things')
        cy.get('.blog').eq(2).should('contain', 'Least Likes')
      })
    })
  })
})