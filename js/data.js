// Traffic Fine BD - offence data. Maximum fines under the Road Transport Act 2018
// (in force 1 November 2019), as reported by The Daily Star and The Business
// Standard (TBS), November 2019. "fine" is the statutory maximum in BDT;
// "jail" is the maximum jail term in months (null = no jail term stated in sources).
// "demerit" marks offences named in sources as demerit-point offence types.
// Works in browser (window.TRAFFIC_DATA) and Node (module.exports) for tests.
(function (root) {
  var DATA = {
  "categories": [
    { "id": "licence", "en": "Licence", "bn": "\u09b2\u09be\u0987\u09b8\u09c7\u09a8\u09cd\u09b8" },
    { "id": "registration", "en": "Registration & Vehicle", "bn": "\u09b0\u09c7\u099c\u09bf\u09b8\u09cd\u099f\u09cd\u09b0\u09c7\u09b6\u09a8 \u0993 \u09ab\u09bf\u099f\u09a8\u09c7\u09b8" },
    { "id": "conduct", "en": "Driving Conduct", "bn": "\u099a\u09be\u09b2\u09a8\u09be\u09b0 \u0986\u099a\u09b0\u09a3" },
    { "id": "accident", "en": "After an Accident", "bn": "\u09a6\u09c1\u09b0\u09cd\u0998\u099f\u09a8\u09be \u09b8\u0982\u0995\u09cd\u09b0\u09be\u09a8\u09cd\u09a4" }
  ],
  "offences": [
    {
      "id": "no-licence", "cat": "licence", "fine": 25000, "jail": 6, "demerit": false,
      "en": { "title": "Driving without a driving licence", "desc": "Driving a motor vehicle without a valid driving licence." },
      "bn": { "title": "\u09a1\u09cd\u09b0\u09be\u0987\u09ad\u09bf\u0982 \u09b2\u09be\u0987\u09b8\u09c7\u09a8\u09cd\u09b8 \u099b\u09be\u09a1\u09bc\u09be \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb", "desc": "\u09ac\u09c8\u09a7 \u09a1\u09cd\u09b0\u09be\u0987\u09ad\u09bf\u0982 \u09b2\u09be\u0987\u09b8\u09c7\u09a8\u09cd\u09b8 \u099b\u09be\u09a1\u09bc\u09be \u09ae\u09cb\u099f\u09b0\u09af\u09be\u09a8 \u099a\u09be\u09b2\u09be\u09a8\u09cb\u0964" }
    },
    {
      "id": "fake-licence", "cat": "licence", "fine": 500000, "jail": 24, "demerit": false,
      "en": { "title": "Fake licence or fake number plate", "desc": "Driving with a fake driving licence or a fake number plate." },
      "bn": { "title": "\u09ad\u09c1\u09af\u09bc\u09be \u09b2\u09be\u0987\u09b8\u09c7\u09a8\u09cd\u09b8 \u09ac\u09be \u09ad\u09c1\u09af\u09bc\u09be \u09a8\u09ae\u09cd\u09ac\u09b0 \u09aa\u09cd\u09b2\u09c7\u099f \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0", "desc": "\u099c\u09be\u09b2 \u09b2\u09be\u0987\u09b8\u09c7\u09a8\u09cd\u09b8 \u09ac\u09be \u099c\u09be\u09b2 \u09a8\u09ae\u09cd\u09ac\u09b0 \u09aa\u09cd\u09b2\u09c7\u099f \u09a6\u09bf\u09af\u09bc\u09c7 \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb\u0964" }
    },
    {
      "id": "unregistered", "cat": "registration", "fine": 50000, "jail": 6, "demerit": false,
      "en": { "title": "Driving an unregistered vehicle", "desc": "Driving a motor vehicle without registration and number plate." },
      "bn": { "title": "\u09b0\u09c7\u099c\u09bf\u09b8\u09cd\u099f\u09cd\u09b0\u09c7\u09b6\u09a8 \u099b\u09be\u09a1\u09bc\u09be \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb", "desc": "\u09b0\u09c7\u099c\u09bf\u09b8\u09cd\u099f\u09cd\u09b0\u09c7\u09b6\u09a8 \u0993 \u09a8\u09ae\u09cd\u09ac\u09b0 \u09aa\u09cd\u09b2\u09c7\u099f \u099b\u09be\u09a1\u09bc\u09be \u09ae\u09cb\u099f\u09b0\u09af\u09be\u09a8 \u099a\u09be\u09b2\u09be\u09a8\u09cb\u0964" }
    },
    {
      "id": "no-fitness", "cat": "registration", "fine": 25000, "jail": null, "demerit": false,
      "en": { "title": "Driving without a fitness certificate", "desc": "Driving with an expired or missing fitness certificate." },
      "bn": { "title": "\u09ab\u09bf\u099f\u09a8\u09c7\u09b8 \u09b8\u09be\u09b0\u09cd\u099f\u09bf\u09ab\u09bf\u0995\u09c7\u099f \u099b\u09be\u09a1\u09bc\u09be \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb", "desc": "\u09ae\u09c7\u09af\u09bc\u09be\u09a6\u09cb\u09a4\u09cd\u09a4\u09c0\u09b0\u09cd\u09a3 \u09ac\u09be \u0985\u09a8\u09c1\u09aa\u09b8\u09cd\u09a5\u09bf\u09a4 \u09ab\u09bf\u099f\u09a8\u09c7\u09b8 \u09b8\u09be\u09b0\u09cd\u099f\u09bf\u09ab\u09bf\u0995\u09c7\u099f \u09a8\u09bf\u09af\u09bc\u09c7 \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb\u0964" }
    },
    {
      "id": "modification", "cat": "registration", "fine": 300000, "jail": 36, "demerit": false,
      "en": { "title": "Unlawful vehicle modification", "desc": "Using a left-hand drive vehicle without permission, or changing the vehicle's length or width, seat arrangement, wheel size, brakes, gears, horn, indicators, exhaust system or colour." },
      "bn": { "title": "\u0985\u09ac\u09c8\u09a7\u09ad\u09be\u09ac\u09c7 \u0997\u09be\u09a1\u09bc\u09bf\u09b0 \u0995\u09be\u09a0\u09be\u09ae\u09cb \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8", "desc": "\u0985\u09a8\u09c1\u09ae\u09a4\u09bf \u099b\u09be\u09a1\u09bc\u09be \u09ac\u09be\u09ae \u09b9\u09be\u09a4\u09c7 \u099a\u09be\u09b2\u09bf\u09a4 \u0997\u09be\u09a1\u09bc\u09bf \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u09ac\u09be \u0997\u09be\u09a1\u09bc\u09bf\u09b0 \u09a6\u09c8\u09b0\u09cd\u0998\u09cd\u09af-\u09aa\u09cd\u09b0\u09b8\u09cd\u09a5, \u0986\u09b8\u09a8, \u099a\u09be\u0995\u09be, \u09ac\u09cd\u09b0\u09c7\u0995, \u09b9\u09b0\u09cd\u09a8, \u09a8\u09bf\u09b7\u09cd\u0995\u09be\u09b6\u09a8 \u09ac\u09cd\u09af\u09ac\u09b8\u09cd\u09a5\u09be \u09ac\u09be \u09b0\u0982 \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8\u0964" }
    },
    {
      "id": "overloading", "cat": "registration", "fine": 100000, "jail": 12, "demerit": false,
      "en": { "title": "Overloading beyond approved laden weight", "desc": "Carrying passengers, goods and fuel beyond the vehicle's approved laden weight." },
      "bn": { "title": "\u0985\u09a4\u09bf\u09b0\u09bf\u0995\u09cd\u09a4 \u0993\u099c\u09a8 \u09ac\u09b9\u09a8 (\u0993\u09ad\u09be\u09b0\u09b2\u09cb\u09a1\u09bf\u0982)", "desc": "\u0985\u09a8\u09c1\u09ae\u09cb\u09a6\u09bf\u09a4 \u09ad\u09be\u09b0\u09ac\u09b9\u09a8 \u0995\u09cd\u09b7\u09ae\u09a4\u09be\u09b0 \u099a\u09c7\u09af\u09bc\u09c7 \u09ac\u09c7\u09b6\u09bf \u09af\u09be\u09a4\u09cd\u09b0\u09c0, \u09ae\u09be\u09b2\u09be\u09ae\u09be\u09b2 \u09ac\u09be \u099c\u09cd\u09ac\u09be\u09b2\u09be\u09a8\u09bf\u09b8\u09b9 \u0993\u099c\u09a8 \u09ac\u09b9\u09a8\u0964" }
    },
    {
      "id": "reckless", "cat": "conduct", "fine": 10000, "jail": 3, "demerit": true,
      "en": { "title": "Reckless driving or risky overtake", "desc": "Driving recklessly or overtaking in a risky way." },
      "bn": { "title": "\u09ac\u09c7\u09aa\u09b0\u09cb\u09af\u09bc\u09be \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb \u09ac\u09be \u099d\u09c1\u0981\u0995\u09bf\u09aa\u09c2\u09b0\u09cd\u09a3 \u0993\u09ad\u09be\u09b0\u099f\u09c7\u0995", "desc": "\u09ac\u09c7\u09aa\u09b0\u09cb\u09af\u09bc\u09be\u09ad\u09be\u09ac\u09c7 \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb \u09ac\u09be \u099d\u09c1\u0981\u0995\u09bf \u09a8\u09bf\u09af\u09bc\u09c7 \u0993\u09ad\u09be\u09b0\u099f\u09c7\u0995 \u0995\u09b0\u09be\u0964" }
    },
    {
      "id": "drunk", "cat": "conduct", "fine": 10000, "jail": 3, "demerit": true,
      "en": { "title": "Driving under the influence", "desc": "Driving under the influence of alcohol or drugs, or staying in a vehicle in an inebriated state." },
      "bn": { "title": "\u09ae\u09a6\u09cd\u09af\u09aa \u09ac\u09be \u09a8\u09c7\u09b6\u09be\u0997\u09cd\u09b0\u09b8\u09cd\u09a4 \u0985\u09ac\u09b8\u09cd\u09a5\u09be\u09af\u09bc \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb", "desc": "\u0985\u09cd\u09af\u09be\u09b2\u0995\u09cb\u09b9\u09b2 \u09ac\u09be \u09ae\u09be\u09a6\u0995\u09c7\u09b0 \u09aa\u09cd\u09b0\u09ad\u09be\u09ac\u09c7 \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb\u0964" }
    },
    {
      "id": "wrong-side", "cat": "conduct", "fine": 10000, "jail": null, "demerit": true,
      "en": { "title": "Driving on the wrong side", "desc": "Driving a vehicle in the wrong direction on the road." },
      "bn": { "title": "\u0989\u09b2\u09cd\u099f\u09cb \u09a6\u09bf\u0995\u09c7 \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb", "desc": "\u09b8\u09a1\u09bc\u0995\u09c7\u09b0 \u09ad\u09c1\u09b2 \u09a6\u09bf\u0995\u09c7 \u09ac\u09be \u09ac\u09bf\u09aa\u09b0\u09c0\u09a4 \u09b2\u09c7\u09a8\u09c7 \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb\u0964" }
    },
    {
      "id": "speeding", "cat": "conduct", "fine": 10000, "jail": null, "demerit": true,
      "en": { "title": "Overspeeding", "desc": "Driving above the posted speed limit." },
      "bn": { "title": "\u0985\u09a4\u09bf\u09b0\u09bf\u0995\u09cd\u09a4 \u0997\u09a4\u09bf\u09a4\u09c7 \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb", "desc": "\u09a8\u09bf\u09b0\u09cd\u09a7\u09be\u09b0\u09bf\u09a4 \u0997\u09a4\u09bf\u09b8\u09c0\u09ae\u09be \u0985\u09a4\u09bf\u0995\u09cd\u09b0\u09ae \u0995\u09b0\u09c7 \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb\u0964" }
    },
    {
      "id": "signal", "cat": "conduct", "fine": 10000, "jail": null, "demerit": true,
      "en": { "title": "Violating a traffic signal", "desc": "Driving through a red light or ignoring traffic signs and signals." },
      "bn": { "title": "\u099f\u09cd\u09b0\u09be\u09ab\u09bf\u0995 \u09b8\u09bf\u0997\u09a8\u09cd\u09af\u09be\u09b2 \u0985\u09ae\u09be\u09a8\u09cd\u09af \u0995\u09b0\u09be", "desc": "\u09b2\u09be\u09b2 \u09ac\u09be\u09a4\u09bf \u09ac\u09be \u099f\u09cd\u09b0\u09be\u09ab\u09bf\u0995 \u09b8\u09bf\u0997\u09a8\u09cd\u09af\u09be\u09b2 \u09a8\u09be \u09ae\u09c7\u09a8\u09c7 \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb\u0964" }
    },
    {
      "id": "no-helmet", "cat": "conduct", "fine": 10000, "jail": null, "demerit": false,
      "en": { "title": "Riding a motorcycle without a helmet", "desc": "Riding a motorcycle without wearing a helmet." },
      "bn": { "title": "\u09b9\u09c7\u09b2\u09ae\u09c7\u099f \u099b\u09be\u09a1\u09bc\u09be \u09ae\u09cb\u099f\u09b0\u09b8\u09be\u0987\u0995\u09c7\u09b2 \u099a\u09be\u09b2\u09be\u09a8\u09cb", "desc": "\u09ae\u09cb\u099f\u09b0\u09b8\u09be\u0987\u0995\u09c7\u09b2\u09c7 \u09b9\u09c7\u09b2\u09ae\u09c7\u099f \u099b\u09be\u09a1\u09bc\u09be \u099a\u09be\u09b2\u09be\u09a8\u09cb\u0964" }
    },
    {
      "id": "three-on-bike", "cat": "conduct", "fine": 10000, "jail": null, "demerit": false,
      "en": { "title": "More than two people on a motorcycle", "desc": "Carrying more than two people on a motorcycle." },
      "bn": { "title": "\u09ae\u09cb\u099f\u09b0\u09b8\u09be\u0987\u0995\u09c7\u09b2\u09c7 \u09a6\u09c1\u099c\u09a8\u09c7\u09b0 \u09ac\u09c7\u09b6\u09bf \u09af\u09be\u09a4\u09cd\u09b0\u09c0", "desc": "\u098f\u0995\u099f\u09bf \u09ae\u09cb\u099f\u09b0\u09b8\u09be\u0987\u0995\u09c7\u09b2\u09c7 \u09a6\u09c1\u099c\u09a8\u09c7\u09b0 \u09ac\u09c7\u09b6\u09bf \u09ae\u09be\u09a8\u09c1\u09b7 \u09ac\u09b9\u09a8\u0964" }
    },
    {
      "id": "horn", "cat": "conduct", "fine": 10000, "jail": 3, "demerit": true,
      "en": { "title": "Blowing a banned or loud horn", "desc": "Using a banned horn or blowing the horn loudly." },
      "bn": { "title": "\u09a8\u09bf\u09b7\u09bf\u09a6\u09cd\u09a7 \u09ac\u09be \u0989\u099a\u09cd\u099a \u09b6\u09ac\u09cd\u09a6\u09c7 \u09b9\u09b0\u09cd\u09a8 \u09ac\u09be\u099c\u09be\u09a8\u09cb", "desc": "\u09a8\u09bf\u09b7\u09bf\u09a6\u09cd\u09a7 \u09b9\u09b0\u09cd\u09a8 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u09ac\u09be \u099c\u09cb\u09b0\u09c7 \u09b9\u09b0\u09cd\u09a8 \u09ac\u09be\u099c\u09be\u09a8\u09cb\u0964" }
    },
    {
      "id": "seatbelt", "cat": "conduct", "fine": 5000, "jail": null, "demerit": false,
      "en": { "title": "Driving without a seatbelt", "desc": "Driving without fastening the seatbelt." },
      "bn": { "title": "\u09b8\u09bf\u099f\u09ac\u09c7\u09b2\u09cd\u099f \u09a8\u09be \u09aa\u09b0\u09c7 \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb", "desc": "\u09b8\u09bf\u099f\u09ac\u09c7\u09b2\u09cd\u099f \u09a8\u09be \u09ac\u09c7\u0981\u09a7\u09c7 \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb\u0964" }
    },
    {
      "id": "mobile", "cat": "conduct", "fine": 5000, "jail": null, "demerit": false,
      "en": { "title": "Using a mobile phone while driving", "desc": "Talking on the phone or using a mobile phone while the vehicle is moving." },
      "bn": { "title": "\u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09be\u09a8\u09cb\u09b0 \u09b8\u09ae\u09af\u09bc \u09ae\u09cb\u09ac\u09be\u0987\u09b2 \u09ab\u09cb\u09a8 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0", "desc": "\u099a\u09b2\u09a8\u09cd\u09a4 \u0985\u09ac\u09b8\u09cd\u09a5\u09be\u09af\u09bc \u09ab\u09cb\u09a8\u09c7 \u0995\u09a5\u09be \u09ac\u09b2\u09be \u09ac\u09be \u09ab\u09cb\u09a8 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09be\u0964" }
    },
    {
      "id": "jaywalking", "cat": "conduct", "fine": 5000, "jail": null, "demerit": false,
      "en": { "title": "Jaywalking", "desc": "Crossing the road outside a designated crossing." },
      "bn": { "title": "\u099c\u09c7\u09ac\u09cd\u09b0\u09be \u0995\u09cd\u09b0\u09b8\u09bf\u0982 \u099b\u09be\u09a1\u09bc\u09be \u09b0\u09be\u09b8\u09cd\u09a4\u09be \u09aa\u09be\u09b0 \u09b9\u0993\u09af\u09bc\u09be", "desc": "\u09a8\u09bf\u09b0\u09cd\u09a7\u09be\u09b0\u09bf\u09a4 \u0995\u09cd\u09b0\u09b8\u09bf\u0982 \u099b\u09be\u09a1\u09bc\u09be \u09b0\u09be\u09b8\u09cd\u09a4\u09be \u09aa\u09be\u09b0 \u09b9\u0993\u09af\u09bc\u09be\u0964" }
    },
    {
      "id": "parking", "cat": "conduct", "fine": 5000, "jail": null, "demerit": false,
      "en": { "title": "Illegal parking", "desc": "Parking a vehicle in a prohibited place." },
      "bn": { "title": "\u0985\u09ac\u09c8\u09a7 \u09aa\u09be\u09b0\u09cd\u0995\u09bf\u0982", "desc": "\u09a8\u09bf\u09b7\u09bf\u09a6\u09cd\u09a7 \u09b8\u09cd\u09a5\u09be\u09a8\u09c7 \u0997\u09be\u09a1\u09bc\u09bf \u09aa\u09be\u09b0\u09cd\u0995 \u0995\u09b0\u09be\u0964" }
    },
    {
      "id": "boarding", "cat": "conduct", "fine": 5000, "jail": null, "demerit": false,
      "en": { "title": "Boarding or unloading without stopping", "desc": "Taking on or letting off passengers or goods without stopping the vehicle." },
      "bn": { "title": "\u09a8\u09be \u09a5\u09c7\u09ae\u09c7 \u09af\u09be\u09a4\u09cd\u09b0\u09c0 \u09ac\u09be \u09ae\u09be\u09b2\u09be\u09ae\u09be\u09b2 \u0993\u09a0\u09be\u09a8\u09cb-\u09a8\u09be\u09ae\u09be\u09a8\u09cb", "desc": "\u0997\u09be\u09a1\u09bc\u09bf \u09a8\u09be \u09a5\u09be\u09ae\u09bf\u09af\u09bc\u09c7 \u09af\u09be\u09a4\u09cd\u09b0\u09c0 \u09ac\u09be \u09ae\u09be\u09b2\u09be\u09ae\u09be\u09b2 \u0993\u09a0\u09be\u09a8\u09cb \u09ac\u09be \u09a8\u09be\u09ae\u09be\u09a8\u09cb\u0964" }
    },
    {
      "id": "excess-fare", "cat": "conduct", "fine": 10000, "jail": 1, "demerit": true,
      "en": { "title": "Charging excess fare without a fare chart", "desc": "Collecting excess fare from passengers without a fare list or chart (1 demerit point is also deducted)." },
      "bn": { "title": "\u09ad\u09be\u09a1\u09bc\u09be\u09b0 \u09a4\u09be\u09b2\u09bf\u0995\u09be \u099b\u09be\u09a1\u09bc\u09be \u0985\u09a4\u09bf\u09b0\u09bf\u0995\u09cd\u09a4 \u09ad\u09be\u09a1\u09bc\u09be \u0986\u09a6\u09be\u09af\u09bc", "desc": "\u09ad\u09be\u09a1\u09bc\u09be\u09b0 \u09a4\u09be\u09b2\u09bf\u0995\u09be \u099b\u09be\u09a1\u09bc\u09be \u09af\u09be\u09a4\u09cd\u09b0\u09c0\u09a6\u09c7\u09b0 \u0995\u09be\u099b \u09a5\u09c7\u0995\u09c7 \u0985\u09a4\u09bf\u09b0\u09bf\u0995\u09cd\u09a4 \u09ad\u09be\u09a1\u09bc\u09be \u09a8\u09c7\u0993\u09af\u09bc\u09be (\u09e7 \u09a1\u09bf\u09ae\u09c7\u09b0\u09bf\u099f \u09aa\u09af\u09bc\u09c7\u09a8\u09cd\u099f\u0993 \u0995\u09be\u099f\u09be \u09b9\u09af\u09bc)\u0964" }
    },
    {
      "id": "no-report", "cat": "accident", "fine": 20000, "jail": 1, "demerit": false,
      "en": { "title": "Not informing police or fire service after an accident", "desc": "Failing to inform the nearest police station and Fire Service after an accident." },
      "bn": { "title": "\u09a6\u09c1\u09b0\u09cd\u0998\u099f\u09a8\u09be\u09b0 \u09aa\u09b0 \u09aa\u09c1\u09b2\u09bf\u09b6 \u09ac\u09be \u09ab\u09be\u09af\u09bc\u09be\u09b0 \u09b8\u09be\u09b0\u09cd\u09ad\u09bf\u09b8\u0995\u09c7 \u09a8\u09be \u099c\u09be\u09a8\u09be\u09a8\u09cb", "desc": "\u09a6\u09c1\u09b0\u09cd\u0998\u099f\u09a8\u09be\u09b0 \u09aa\u09b0 \u0995\u09be\u099b\u09c7\u09b0 \u09a5\u09be\u09a8\u09be \u0993 \u09ab\u09be\u09af\u09bc\u09be\u09b0 \u09b8\u09be\u09b0\u09cd\u09ad\u09bf\u09b8\u0995\u09c7 \u09a8\u09be \u099c\u09be\u09a8\u09be\u09a8\u09cb\u0964" }
    },
    {
      "id": "no-hospital", "cat": "accident", "fine": 20000, "jail": 1, "demerit": false,
      "en": { "title": "Not taking injured people to hospital", "desc": "Failing to send people injured in an accident to a hospital." },
      "bn": { "title": "\u0986\u09b9\u09a4 \u09ac\u09cd\u09af\u0995\u09cd\u09a4\u09bf\u0995\u09c7 \u09b9\u09be\u09b8\u09aa\u09be\u09a4\u09be\u09b2\u09c7 \u09a8\u09be \u09aa\u09be\u09a0\u09be\u09a8\u09cb", "desc": "\u09a6\u09c1\u09b0\u09cd\u0998\u099f\u09a8\u09be\u09af\u09bc \u0986\u09b9\u09a4\u09a6\u09c7\u09b0 \u09b9\u09be\u09b8\u09aa\u09be\u09a4\u09be\u09b2\u09c7 \u09aa\u09cc\u0981\u099b\u09c7 \u09a8\u09be \u09a6\u09c7\u0993\u09af\u09bc\u09be\u0964" }
    },
    {
      "id": "fatal-reckless", "cat": "accident", "fine": 500000, "jail": 60, "demerit": false,
      "en": { "title": "Reckless driving causing death or serious injury", "desc": "Reckless or negligent driving that kills or seriously injures someone. Section 105 of the Act; non-bailable." },
      "bn": { "title": "\u09ac\u09c7\u09aa\u09b0\u09cb\u09af\u09bc\u09be \u099a\u09be\u09b2\u09a8\u09be\u09af\u09bc \u09ae\u09c3\u09a4\u09cd\u09af\u09c1 \u09ac\u09be \u0997\u09c1\u09b0\u09c1\u09a4\u09b0 \u0986\u0998\u09be\u09a4", "desc": "\u09ac\u09c7\u09aa\u09b0\u09cb\u09af\u09bc\u09be \u09ac\u09be \u0985\u09ac\u09b9\u09c7\u09b2\u09be\u09af\u09bc \u0997\u09be\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09bf\u09af\u09bc\u09c7 \u0995\u09be\u0989\u0995\u09c7 \u09b9\u09a4\u09cd\u09af\u09be \u09ac\u09be \u0997\u09c1\u09b0\u09c1\u09a4\u09b0 \u0986\u09b9\u09a4 \u0995\u09b0\u09be\u0964 \u0986\u0987\u09a8\u09c7\u09b0 \u09a7\u09be\u09b0\u09be \u09e7\u09e6\u09eb; \u099c\u09be\u09ae\u09bf\u09a8 \u0985\u09af\u09cb\u0997\u09cd\u09af\u0964" }
    }
  ]
  };

  // ---------- pure logic (shared by app + node tests) ----------
  function norm(s) { return String(s == null ? "" : s).toLowerCase(); }

  function filterOffences(list, query, cat) {
    var q = norm(query).trim();
    return list.filter(function (o) {
      if (cat && cat !== "all" && o.cat !== cat) return false;
      if (!q) return true;
      var hay = norm(o.en.title) + " " + norm(o.en.desc) + " " + norm(o.bn.title) + " " + norm(o.bn.desc);
      return q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
    });
  }

  function sortOffences(list, mode) {
    var arr = list.slice();
    if (mode === "low") arr.sort(function (a, b) { return a.fine - b.fine; });
    else if (mode === "az") arr.sort(function (a, b) { return a.en.title < b.en.title ? -1 : 1; });
    else arr.sort(function (a, b) { return b.fine - a.fine; }); // "high" default
    return arr;
  }

  // ids: array of offence ids. Total fine = sum of maxima. Jail = longest single
  // term (terms run per offence; a court decides). Demerit = count of demerit offences.
  function calcTotal(list, ids) {
    var total = 0, maxJail = 0, demerit = 0, count = 0;
    var byId = {};
    list.forEach(function (o) { byId[o.id] = o; });
    ids.forEach(function (id) {
      var o = byId[id];
      if (!o) return;
      count += 1;
      total += o.fine;
      if (o.jail && o.jail > maxJail) maxJail = o.jail;
      if (o.demerit) demerit += 1;
    });
    return { count: count, totalFine: total, maxJail: maxJail, demeritCount: demerit };
  }

  function formatBDT(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Format a jail term in months: 1 -> "1 month", 6 -> "6 months", 24 -> "2 years", 60 -> "5 years".
  function jailText(months) {
    if (!months) return null;
    if (months % 12 === 0) {
      var y = months / 12;
      return "up to " + y + (y === 1 ? " year" : " years");
    }
    return "up to " + months + (months === 1 ? " month" : " months");
  }

  DATA.logic = {
    filterOffences: filterOffences,
    sortOffences: sortOffences,
    calcTotal: calcTotal,
    formatBDT: formatBDT,
    jailText: jailText
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = DATA;
  } else {
    root.TRAFFIC_DATA = DATA;
  }
})(typeof window !== "undefined" ? window : this);
