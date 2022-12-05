using API.Helpers;
using AutoMapper;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileSharingAppUnitTests.Helpers
{
    public class AutoMapperGenerator
    {
        public static Mapper CreateAutoMapper()
        {
            //var automapperConfig = new MapperConfiguration(cfg =>
            //    cfg.AddProfile<AutoMapperProfiles>());
            //var autoMapper = new Mapper(automapperConfig);
            //return autoMapper;

            var automapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<RegisterDto, AppUser>();
                cfg.CreateMap<AppUser, UserDto>();
                cfg.CreateMap<LoginDto, AppUser>();
                cfg.CreateMap<AppUser, LoginDto>();
            });

            var autoMapper = new Mapper(automapperConfig);
            return autoMapper;
        }
    }
}
