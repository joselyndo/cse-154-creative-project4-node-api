# CP4 Flower Garden Walk API Documentation
This API randomizes lists of flowers, provides information on supported flowers, and handles a recommendation system. More specifically, the API handles recording votes on whether people would recommend the Garden Walk or not as well as getting the percenage of positive recommendations.

## Get lists of randomized flowers
**Request Format:** /random-flowers/:amount

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Generates three lists of randomized flowers, where the amount of flowers depends on the given quantity. Each list is separated by a new line and each entry in the list is separated by a colon (":")

**Example Request:** /random-flowers/4

**Example Response:**
```
hydrangea:begonia:gladiolus:peony
gladiolus:peony:rhododendron:aster
dahlia:nemophila:carnation:wisteria
```

**Error Handling:**
- 400 errors (All plain text):
  - If the provided quantity is less than 1, returns an error with the message: "Invalid quantity".
- 500 errors (All plain text):
  - If the file containing the flower names cannot be found or opened, returns an error with the message: "Unable to generate random lists of flowers".
  - If an issue occurred on the server, returns error with message: "An error has occurred on the server".


## Get flower information
**Request Format:** /flower/:flowerName

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Get the information for the specified flower. The information includes a name, an image, the image's credit, a fact, and the fact's credit.

**Example Request:** /flower/zinnia

**Example Response:**
```json
{
  "name": "Zinnia",
  "image": "img/zinnia.jpeg",
  "image-credit": "https://search.app.goo.gl/eMdR5GE",
  "fun-fact": "One of the great things about zinnias is their extensive blooming season. They typically flower from early summer until the first frost, providing continuous beauty to your garden.",
  "fun-fact-credit": "https://facts.net/nature/plants/14-intriguing-facts-about-zinnia/"
}
```

**Error Handling:**
- 400 errors (All plain text):
  - If the provided flower name is not one of the possible flowers in the randomized lists, returns an error with the message: "Flower not supported".
- 500 errors (All plain text):
  - If the file containing the flower information cannot be found or opened, returns an error with the message: "Unable to access the flower information file".
  - If an issue occurred on the server, returns error with message: "An error has occurred on the server".


## Record new recommendation vote
**Request Format:** /recommendation/add with POST parameter of the form "recommendation"

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Records the recommendation of the user

**Example Request 1:** /recommendation/add with "recommendation=yes"

**Example Response 1:**
```
Thank you for your feedback
```

**Example Request 2:** /recommendation/add with "recommendation=no"

**Example Response 2:**
```
Thank you for your feedback
```

**Error Handling:**
- 400 errors (All plain text):
  - If no input is given or the input is not "yes" nor "no", returns an error with the message: "No valid input received for recommendation"
- 500 errors (All plain text):
  - If the file storing the recommendations cannot be accessed, returns an error with the message: "Unable to access file with requested information"
  - If an issue occurred on the server, returns an error with the message: "An error has occurred on the server"


## Get user recommendation rate
**Request Format:** /recommendation/get

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Sends a number representing the percentage of past visitors who would recommend the Garden Walk

**Example Request:** /recommendation/get

**Example Response:**
```
81
```

**Error Handling:**
- 500 errors (All plain text):
  - If the file storing the recommendations cannot be accessed, returns an error with the message: "Unable to access file with requested information"
  - If an issue occurred on the server, returns an error with the message: "An error has occurred on the server"