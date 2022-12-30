using AutoMapper;
using FileSharingAppUnitTests.Helpers;
using Xunit;

namespace FileSharingAppUnitTests.HelperTests
{
    public class AutoMapperUnitTests : BaseUnitTest 
    {
        private readonly MapperConfiguration mapperConfiguration;
        private readonly IMapper mapper;
        public AutoMapperUnitTests()
        {
            this.mapperConfiguration = AutoMapperTestConfigGenerator.GenerateTestMapperConfig();

            this.mapper = new Mapper(mapperConfiguration);
        }

        [Fact]
        public void Verify_mapper_configuration_is_correct()
        {
            //Assert
            this.mapperConfiguration.AssertConfigurationIsValid();
        }
    }
}
