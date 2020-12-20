import { Context } from "moleculer";


export function authorize(ctx: Context, route: any, req: any, res: any) {
    const auth = req.headers.authorization;
     (auth);
    try {
      req.$params = { ...req.$params };
      return Promise.resolve(ctx);
    } catch (error) {
       (error)
      return Promise.resolve(ctx);
    }
  }
export async function authenticate(ctx: Context, route: any, req: any, res: any) {
  const auth = req.headers.authenticate;
   (auth);
}