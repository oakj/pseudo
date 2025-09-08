using Microsoft.Extensions.Logging;
using Moq;
using PseudoApi.Controllers;
using System.Linq;

namespace PseudoApi.Tests;

public class WeatherForecastControllerTests
{
    [Fact]
    public void Get_ReturnsCorrectNumberOfForecasts()
    {
        // Arrange
        var loggerMock = new Mock<ILogger<WeatherForecastController>>();
        var controller = new WeatherForecastController(loggerMock.Object);

        // Act
        var result = controller.Get();

        // Assert
        Assert.Equal(5, result.Count());
    }

    [Fact]
    public void Get_ForecastsHaveValidTemperatures()
    {
        // Arrange
        var loggerMock = new Mock<ILogger<WeatherForecastController>>();
        var controller = new WeatherForecastController(loggerMock.Object);

        // Act
        var forecasts = controller.Get();

        // Assert
        foreach (var forecast in forecasts)
        {
            Assert.InRange(forecast.TemperatureC, -20, 55);
            Assert.Equal(32 + (int)(forecast.TemperatureC / 0.5556), forecast.TemperatureF);
        }
    }
}

