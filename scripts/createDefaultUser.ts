import { nanoid } from 'nanoid';
import { UserController } from '../server/trpc/controllers/user';

const userController = new UserController();
const password = nanoid(10);
await userController.register({ id: 'admin', password });
console.log(`Created default admin user. \nUserID: 'admin' \nPassword: '${password}'`);
const admin = await userController.login('admin', password);
console.log('Admin AccessToken:');
console.log(admin?.accessToken);
