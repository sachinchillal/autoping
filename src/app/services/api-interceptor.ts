import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

const accessCode = environment.accessCode;
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // add access code to the request header
  const newReq = req.clone({
    headers: req.headers.append('accesscode', accessCode)
  });
  return next(newReq);
};
