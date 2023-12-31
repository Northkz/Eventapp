const axios = require('axios').default;
const parseString = require('xml2js').parseString;
const { get_logger } = require('../utils/logger')
// Get Logger
const logger = get_logger()

const apiUrl = 'https://api.data.gov.hk/v1/historical-archive/get-file';
const apiUrlVersion = `https://api.data.gov.hk/v1/historical-archive/list-file-versions`;

// Function to retrieve a historical version of a file
async function getAvailableFileVersions (startDate, endDate, fileUrl){
  try {
    // Make the GET request
    const response = await axios.get(apiUrlVersion, {
      params: {
        url: fileUrl,
        start: startDate,
        end: endDate,
      }
    });
    if (response.status === 200) {
      fileVersions = response.data.timestamps;
      return fileVersions

    } else {
      logger.error('Could not find(:', response.data);
    }
  } catch (error) {
    logger.error('Error retrieving file:', error);
  }
};



// Function to retrieve a historical version of a file
const getEvent = async (startDate, fileUrl) => {
  try {
    // Make the GET request
    const response = await axios.get(apiUrl, {
      params: {
        url: fileUrl,
        time: startDate,
      }
    });
    return response.data

  } catch (error) {
    logger.error('Error retrieving file:', error);
  }
};


const getVenue = async (startDate, fileUrl) => {
  try {
    // Make the GET request
    const response = await axios.get(apiUrl, {
      params: {
        url: fileUrl,
        time: startDate,
      }
    });
    return response.data;
  } catch (error) {
    logger.error('Error retrieving file:', error);
  }
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}


async function extractData(){
  // Define the start and end date 
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 2);
  currentDate.setDate(yesterday.getDate() + 1);
  
  const end = formatDate(currentDate);
  const start = formatDate(yesterday);
  
  
  let fileUrlEvent = 'https://www.lcsd.gov.hk/datagovhk/event/events.xml';
  let fileUrlVenue = 'https://www.lcsd.gov.hk/datagovhk/event/venues.xml';
  

  let timeEvent = await getAvailableFileVersions(start, end, fileUrlEvent)
  let timeVenue = await getAvailableFileVersions(start, end, fileUrlVenue)

  // Call the function to retrieve the files

  let xmlDataEvent  = await getEvent(timeEvent[0], fileUrlEvent);
  let xmlDataVenue = await getVenue(timeVenue[0], fileUrlVenue);
  let result;
  
  parseString(xmlDataVenue, (errVenue, resultVenue) => {
    if (errVenue) {
      logger.error('Error parsing venue XML:', errVenue.message);
      return;
    }
  
    parseString(xmlDataEvent, (errEvent, resultEvent) => {
      if (errEvent) {
        logger.error('Error parsing event XML:', errEvent.message);
        return;
      }
  
      // Extract relevant information
      const venues = resultVenue.venues.venue;
      const events = resultEvent.events.event;
      // Find venues with at least 3 events
      const selectedVenues = venues.filter((venue) => {
        const venueId = venue.$.id;
        const venueEvents = events.filter((event) => event.venueid[0] === venueId);
        const hasEnoughEvents = venueEvents.length >= 3;
        const hasValidLocation = venue.latitude[0] && venue.longitude[0];
        return (
          hasEnoughEvents &&
          hasValidLocation &&
          venueEvents.every(
            (event) => event.pricec && event.pricec[0] && event.desce && (event.desce!= null)) // Check if pricec and desce are present
          );
      });
      
      // Extract details for selected venues
      const extractedVenues = selectedVenues.slice(0, 10).map((venue) => {
        const venueId = venue.$.id;
        const venueNameE = venue.venuee[0];
        const latitude = venue.latitude[0];
        const longitude = venue.longitude[0];
        // Find events for the selected venue
        const venueEvents = events.filter((event) => event.venueid[0] === venueId);
  
        // Extract details for each event
        const extractedEvents = venueEvents.map((event) => {
          const eventId = event.$.id;
          const titleE = event.titlee[0];
          const predateE = event.predateE[0];
          const progtimeE = event.progtimee[0];
          const descE = event.desce[0];
          const presenterOrgC = event.presenterorgc[0];
          let priceC = 0;
          try{
            const cleanedPriceData = event.pricec[0].replace(/\$|\s/g, '');
            const prices = cleanedPriceData.split(',');
            const numericPrices = prices.map(price => parseFloat(price));
            const highestPrice = Math.max(...numericPrices);
            if (highestPrice){
              priceC = highestPrice
            }
          }
          catch{
            logger.error("strange input data")
          }

          return {
            eventId,
            titleE,
            predateE,
            progtimeE,
            descE,
            presenterOrgC,
            priceC,
          };
        });
        return {
          venueId,
          venueNameE,
          latitude,
          longitude,
          events: extractedEvents,
        };
      });
            

      result = extractedVenues
      return result;
    });
  });
  result['start'] = start
  result['end'] = end
  return result;
};
module.exports = { extractData }