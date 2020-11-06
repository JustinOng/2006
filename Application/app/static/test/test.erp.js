const should = chai.should();

describe("ERP", () => {
  describe("inRecord", () => {
    describe("Weekday", () => {
      const record = {
        dayType: "Weekdays",
        startTime: "07:00",
        endTime: "08:00",
      };

      it("should return false right before start time", function () {
        inRecord(record, new Date("2020-11-03T06:59:00")).should.equal(false);
      });

      it("should return true at start time", function () {
        inRecord(record, new Date("2020-11-03T07:00:00")).should.equal(true);
      });

      it("should return true right before end time", function () {
        inRecord(record, new Date("2020-11-03T07:59:00")).should.equal(true);
      });

      it("should return false at end time", function () {
        inRecord(record, new Date("2020-11-03T08:00:00")).should.equal(false);
      });

      it("should return false on Saturday", function () {
        inRecord(record, new Date("2020-11-07T07:00:00")).should.equal(false);
      });

      it("should return false on Sunday", function () {
        inRecord(record, new Date("2020-11-08T07:00:00")).should.equal(false);
      });
    });

    describe("Saturday", () => {
      const record = {
        dayType: "Saturday",
        startTime: "07:00",
        endTime: "08:00",
      };

      it("should return false right before start time", function () {
        inRecord(record, new Date("2020-11-07T06:59:00")).should.equal(false);
      });

      it("should return true at start time", function () {
        inRecord(record, new Date("2020-11-07T07:00:00")).should.equal(true);
      });

      it("should return true right before end time", function () {
        inRecord(record, new Date("2020-11-07T07:59:00")).should.equal(true);
      });

      it("should return false at end time", function () {
        inRecord(record, new Date("2020-11-07T08:00:00")).should.equal(false);
      });

      it("should return false on Sunday", function () {
        inRecord(record, new Date("2020-11-08T07:00:00")).should.equal(false);
      });

      it("should return false on a Weekday", function () {
        inRecord(record, new Date("2020-11-06T07:00:00")).should.equal(false);
      });
    });

    describe("Invalid Record", () => {
      it("should throw if startTime > endTime for a Weekday record", function () {
        should.Throw(() => {
          inRecord(
            {
              dayType: "Weekdays",
              startTime: "08:00",
              endTime: "08:00",
            },
            new Date("2020-11-07T06:59:00")
          );
        });
      });

      it("should throw if startTime > endTime for a Saturday record", function () {
        should.Throw(() => {
          inRecord(
            {
              dayType: "Saturday",
              startTime: "08:00",
              endTime: "08:00",
            },
            new Date("2020-11-07T06:59:00")
          );
        });
      });
    });
  });
});
