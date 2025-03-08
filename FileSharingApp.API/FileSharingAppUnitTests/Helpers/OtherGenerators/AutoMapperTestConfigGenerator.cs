using AutoMapper;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;

namespace FileSharingAppUnitTests.Helpers
{
    public static class AutoMapperTestConfigGenerator
    {
        public static MapperConfiguration GenerateTestMapperConfig()
        {
            return new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<RegisterDto, AppUser>(MemberList.Source)
                    .ForSourceMember(source => source.Password, opt => opt.DoNotValidate());

                cfg.CreateMap<AppUser, UserDto>()
                    .ForMember(dest => dest.Name, opt => opt.Ignore())
                    .ForMember(dest => dest.Token, opt => opt.Ignore());

                cfg.CreateMap<LoginDto, AppUser>(MemberList.Source)
                    .ForSourceMember(source => source.Password, opt => opt.DoNotValidate());

                cfg.CreateMap<AppUser, LoginDto>()
                    .ForMember(dest => dest.Password, opt => opt.Ignore());

                cfg.CreateMap<AppFile, FileDto>()
                    .ForMember(dest => dest.FileTypeName, opt => opt.MapFrom(bf => bf.GetType().Name));
            });

        }
    }
}
