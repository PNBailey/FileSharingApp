using AutoMapper;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<RegisterDto, AppUser>(MemberList.Source)
                .ForSourceMember(source => source.Password, opt => opt.DoNotValidate());

            CreateMap<AppUser, UserDto>()
                .ForMember(dest => dest.Name, opt => opt.Ignore())
                .ForMember(dest => dest.Token, opt => opt.Ignore());

            CreateMap<LoginDto, AppUser>(MemberList.Source)
                .ForSourceMember(source => source.Password, opt => opt.DoNotValidate());

            CreateMap<AppUser, LoginDto>()
                .ForMember(dest => dest.Password, opt => opt.Ignore());

            CreateMap<BaseFile, FileDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(bf => bf.FileData.FileName))
                .ForMember(dest => dest.FileTypeName, opt => opt.MapFrom(bf => bf.GetType().Name));

        }
    }
}
