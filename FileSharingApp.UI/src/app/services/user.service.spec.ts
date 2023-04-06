import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from '../models/user';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('UploadProfilePicture method', () => {
    it('should call http post method with correct url', () => {
      const file = new File([""], "filename", { type: 'text/html' });
      service.uploadProfilePicture(file).subscribe();
      const req = httpMock.expectOne(`https://localhost:7249/api/User/Upload-Profile-Picture`);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('updateUserInfo method', () => {
    it('should call http put mthod with correct url', () => {
      const updatedUser = new User();
      updatedUser.id = 1;
      updatedUser.username = "Mr test";
      updatedUser.bio = "Testing 123";
      service.updateUserInfo(updatedUser).subscribe();
      const req = httpMock.expectOne('https://localhost:7249/api/User/Update');
      expect(req.request.method).toEqual('PUT');
    });
  });
});
