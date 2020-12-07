const { assert } = require('chai')
const { assertRevert } = require('@aragon/contract-test-helpers/assertThrow')
const { newDao, newApp } = require('./helpers/dao')
const { setOpenPermission } = require('./helpers/permissions')

const Vote = artifacts.require('Vote.sol')

contract('Vote', ([appManager, user]) => {
  const INIT_VALUE = 42

  let appBase, app

  before('deploy base app', async () => {
    // Deploy the app's base contract.
    appBase = await Vote.new(INIT_VALUE)
  })

  beforeEach('deploy dao and app', async () => {
    const { dao, acl } = await newDao(appManager)

    // Instantiate a proxy for the app, using the base contract as its logic implementation.
    const proxyAddress = await newApp(dao, 'vote', appBase.address, appManager)
    app = await Vote.at(proxyAddress)

    // Set up the app's permissions.
    await setOpenPermission(acl, app.address, await app.INCREMENT_ROLE(), appManager)
    await setOpenPermission(acl, app.address, await app.DECREMENT_ROLE(), appManager)

    // Initialize the app's proxy.
    await app.initialize(INIT_VALUE)
  })

  it('empty', async () => {
    // Test me!
    })
})
