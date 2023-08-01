using FileSharingApp.API.Data;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileSharingAppUnitTests.Helpers.OtherGenerators
{
    internal static class MockDataContextGenerator
    {
        internal static Mock<DataContext> GenerateMockDataContext()
        {
            return new Mock<DataContext>();  
        }
    }
}
