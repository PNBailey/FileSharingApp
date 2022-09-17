using AutoFixture;
using AutoFixture.AutoMoq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileSharingAppUnitTests
{
    public abstract class BaseUnitTest
    {
        protected IFixture _fixture;
        protected BaseUnitTest()
        {
            _fixture = new Fixture().Customize(new AutoMoqCustomization());
        }
    }
}
