import { UserController } from '../server/trpc/controllers/user';

const userController = new UserController();
await userController.register({ id: 'admin', password: '12345678' });
console.log('Created default admin user. \nUserID: `admin` \nPassword: `12345678`');
const admin = await userController.login('admin', '12345678');
console.log('Admin AccessToken:');
console.log(admin?.accessToken);