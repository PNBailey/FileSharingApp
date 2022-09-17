using AutoMapper;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<RegisterDto, AppUser>();

            CreateMap<AppUser, UserDto>();

            CreateMap<LoginDto, AppUser>();

            CreateMap<AppUser, LoginDto>();
        }
    }
}
