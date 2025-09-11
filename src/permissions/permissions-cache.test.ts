import PermissionCache, {type Project} from './permissions-cache';

describe('PermissionCache', () => {
  function createProject(id: string) {
    return {
      id,
    };
  }

  function createPermission(
    key: string,
    projects?: readonly Project[] | null | undefined,
    isGlobal?: boolean | null | undefined,
  ) {
    return {
      permission: {key},
      projects,
      global: isGlobal,
    };
  }

  it('should create permission cache', () => {
    const permissions = [createPermission('A')];
    const permissionCache = new PermissionCache(permissions);

    expect(permissionCache).to.be.ok;
  });

  it('should not throw exception if we do not pass permissions', () => {
    expect(() => new PermissionCache()).to.not.throw();
  });

  it('should allow set permissions', () => {
    const permissions = [createPermission('A')];
    const permissionCache = new PermissionCache(null);

    permissionCache.set(permissions);

    expect(permissionCache.has('A')).to.be.true;
  });

  it('should allow get permissions', () => {
    const permissions = [createPermission('A')];
    const permissionCache = new PermissionCache(permissions);

    expect(permissionCache.get()!).to.be.equal(permissions);
  });

  it('should check permission', () => {
    const permissions = [createPermission('A')];
    const permissionCache = new PermissionCache(permissions);

    expect(permissionCache.has('A')).to.be.true;
  });

  it('should check permission in project', () => {
    const projectA = createProject('A');
    const projectB = createProject('B');
    const permissions = [createPermission('A', [projectA])];

    const permissionCache = new PermissionCache(permissions);

    expect(permissionCache.has('A', projectA.id)).to.be.true;
    expect(permissionCache.has('A', projectB.id)).to.be.false;
  });

  it('should allow pass name converter', () => {
    const permissions = [createPermission('A')];
    const nameConverter = (key: string) => `#${key}`;

    const permissionCache = new PermissionCache(permissions, nameConverter);

    expect(permissionCache.has('#A')).to.be.true;
  });
});
