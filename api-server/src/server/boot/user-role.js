import debug from 'debug';
import { ifNoUserRedirectHome } from '../utils/middleware';
import {
  insertUserRole,
  updateUserRole,
  getAllUsersRole,
  countUsersRoleDocuments,
  deleteUserRole,
  putUserInRole,
  deleteUserInRole
} from '../utils/user-role';

const log = debug('fcc:boot:user-group');

const sendNonUserToHome = ifNoUserRedirectHome();

function bootUserGroup(app) {
  const api = app.loopback.Router();

  api.post('/user-role/create', sendNonUserToHome, createOneUserRole);
  api.put('/user-role/update', sendNonUserToHome, updateOneUserRole);
  api.get('/all-users-roles', sendNonUserToHome, getUserRoleList);
  api.delete('/user-role/delete', sendNonUserToHome, removeUserRole);

  api.put('/user-role/add-user', sendNonUserToHome, addUserInRole);
  api.put('/user-role/remove-user', sendNonUserToHome, removeUserInRole);

  app.use(api);
}

async function createOneUserRole(req, res) {
  const { userGroupName } = req.body;
  log(userGroupName);

  try {
    if (userGroupName.length == 0) {
      throw new Error('This field should not be empty.');
    }
    let newUserGroup = null;
    newUserGroup = await insertUserRole({ userGroupName: userGroupName });
    if (!newUserGroup.userGroup) {
      throw new Error(newUserGroup.error);
    }

    return res.json(newUserGroup);
  } catch (error) {
    return res.json({
      newUserGroup: null,
      error: error.message
    });
  }
}

async function updateOneUserRole(req, res) {
  // object req.body is { id: string, userGroupName: string }
  const { id } = req.body;
  log(req.body);
  try {
    if (!id || id.length == 0) {
      throw new Error('Please select a group');
    }
    const userGroupUpdated = await updateUserRole(req.body);
    if (userGroupUpdated) {
      return res.json({
        isUpdated: true,
        error: null
      });
    }
    throw new Error('Error in updating Group');
  } catch (error) {
    return res.json({
      isUpdated: false,
      error: error.message
    });
  }
}

async function getUserRoleList(req, res) {
  // destructure page and limit and set default values

  const { page, limit, classRoom } = req.query;

  try {
    let userGroupList = [];
    let usersGroupCount = [];
    const filter = {};
    if (classRoom) {
      filter.userGroupName = new RegExp(`${classRoom}`, 'i');
      userGroupList = await getAllUsersRole(page, limit, filter);
      usersGroupCount = await countUsersRoleDocuments(filter);
    } else {
      userGroupList = await getAllUsersRole(page, limit);
      usersGroupCount = await countUsersRoleDocuments();
    }

    return res.json({
      userGroupList: userGroupList,
      totalPages: Math.ceil(usersGroupCount.length / limit),
      currentPage: page,
      countUsersGroup: usersGroupCount.length
    });
  } catch (error) {
    return res.json({
      userGroupList: null,
      totalPages: null,
      currentPage: null,
      countUsersGroup: null
    });
  }
}

async function removeUserRole(req, res) {
  const { id } = req.body;
  log(req.body);

  try {
    if (!id || id.length == 0) {
      throw new Error('Please select a group');
    }
    const userGroupDeleted = await deleteUserRole(id);
    if (
      userGroupDeleted &&
      // eslint-disable-next-line no-prototype-builtins
      userGroupDeleted.hasOwnProperty('count') &&
      userGroupDeleted.count == 1
    ) {
      return res.json({
        isDeleted: true,
        message: null
      });
    }
    throw new Error('Error in deleting Group');
  } catch (error) {
    return res.json({
      isDeleted: false,
      message: error.message
    });
  }
}

async function addUserInRole(req, res) {
  const id = req.body.ids;
  const group = req.body.userGroup;
  try {
    if (!group) {
      throw new Error('Please select group');
    }
    if (id.length == 0) {
      throw new Error('Please select user');
    }

    const userGroupAdded = await putUserInRole(id, group);
    if (userGroupAdded) {
      return res.json({
        isAdded: true,
        message: `User is added in group ${group}`
      });
    }
  } catch (error) {
    return res.json({
      isAdded: false,
      message: 'User is not added in group'
    });
  }
}

async function removeUserInRole(req, res) {
  const ids = req.body.ids;
  const group = req.body.userGroup;
  try {
    if (!group) {
      throw new Error('Please select group');
    }
    if (!ids || ids.length == 0) {
      throw new Error('Please select user');
    }
    const userGroupRemoved = await deleteUserInRole(ids, group);
    if (userGroupRemoved) {
      res.json({
        isRemoved: true,
        message: 'User is removed in group'
      });
    }
  } catch (error) {
    return res.json({
      isRemoved: false,
      message: 'User is not removed in group'
    });
  }
}

export default bootUserGroup;
