const { post, get } = require("./item");
const Item = require("../models/item");
jest.mock("../models/item");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body, query) => ({
  body: body || {},
  query: query || {}
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("handlers", () => {
  describe("post", () => {
    it("should fail with empty request body", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = jest.fn();
      await post(req, res, next);
      const err = next.mock.calls[0][0];
      expect(next).toHaveBeenCalledTimes(1);
      expect(err.status).toEqual(400);
      expect(err.message).toEqual(
        "required parameters are not set (id, encryption_key, value)"
      );
    });

    it("should call save if everything is set", async () => {
      const req = mockRequest({
        encryption_key: "123",
        value: "123",
        id: "item-id"
      });
      const res = mockResponse();
      const next = jest.fn();
      await post(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Item).toHaveBeenCalledTimes(1);
      expect(Item.mock.calls[0][0]._id).toEqual("item-id");
      expect(Item.mock.calls[0][0].value).not.toEqual(req.body.value);
      expect(Item.mock.calls[0][0].encryption_key).not.toEqual(
        req.body.encryption_key
      );
      expect(Item.mock.instances[0].save).toHaveBeenCalledTimes(1);
    });

    it("should return error if save throws error", async () => {
      const req = mockRequest({
        encryption_key: "123",
        value: "123",
        id: "item-id"
      });
      const res = mockResponse();
      const next = jest.fn();
      const mockSaveFn = jest.fn();
      mockSaveFn.mockRejectedValue(new Error("error"));
      Item.mockImplementation(args => ({
        ...args,
        save: mockSaveFn
      }));

      await post(req, res, next);
      const err = next.mock.calls[0][0];
      expect(next).toHaveBeenCalledTimes(1);
      expect(err.status).toEqual(500);
      expect(err.message).toEqual("unable to save item");
    });

    it("should return custom error on duplicate mongo error", async () => {
      const req = mockRequest({
        encryption_key: "123",
        value: "123",
        id: "item-id"
      });
      const res = mockResponse();
      const next = jest.fn();
      const mockSaveFn = jest.fn();
      mongoErr = new Error("error");
      mongoErr.code = 11000;
      mockSaveFn.mockRejectedValue(mongoErr);
      Item.mockImplementation(args => ({
        ...args,
        save: mockSaveFn
      }));

      await post(req, res, next);
      const err = next.mock.calls[0][0];
      expect(next).toHaveBeenCalledTimes(1);
      expect(err.status).toEqual(409);
      expect(err.message).toEqual("item with this ID is already saved");
    });
  });

  describe("get", () => {
    it("should return error if decryption key is not set", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = jest.fn();
      await get(req, res, next);

      const err = next.mock.calls[0][0];
      expect(next).toHaveBeenCalledTimes(1);
      expect(err.status).toEqual(400);
      expect(err.message).toEqual("decryption key is not set");
    });

    it("should search for item with description key and id is set", async () => {
      const req = mockRequest(
        {},
        {
          key: "decryption-key"
        }
      );
      req.id = "123";
      const res = mockResponse();
      const next = jest.fn();
      const mockFindFn = jest.fn();
      mockFindFn.mockReturnValue([]);
      Item.find = mockFindFn.bind(Item);

      await get(req, res, next);
      expect(mockFindFn).toHaveBeenCalledTimes(1);
      expect(mockFindFn).toHaveBeenCalledWith({
        _id: { $options: "i", $regex: "123" },
        encryption_key:
          "a656ac04aad8b7da649154e11bd472319993fabbf669b86d06c52f7bb467f4ca"
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
