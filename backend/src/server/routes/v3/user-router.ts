import { z } from "zod";

import { ApiKeysSchema } from "@app/db/schemas/api-keys";
import { readLimit } from "@app/server/config/rateLimiter";
import { verifyAuth } from "@app/server/plugins/auth/verify-auth";
import { sanitizedPassHistorySchema } from "@app/server/routes/sanitizedSchemas";
import { AuthMode } from "@app/services/auth/auth-type";

export const registerUserRouter = async (server: FastifyZodProvider) => {
  server.route({
    method: "GET",
    url: "/me/api-keys",
    config: {
      rateLimit: readLimit
    },
    schema: {
      response: {
        200: z.object({
          apiKeyData: ApiKeysSchema.omit({ secretHash: true }).array()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const apiKeyData = await server.services.apiKey.getMyApiKeys(req.permission.id);
      return { apiKeyData };
    }
  });

  server.route({
    method: "GET",
    url: "/credential-history/:userId",
    config: { rateLimit: readLimit },
    schema: {
      params: z.object({ userId: z.string().trim() }),
      response: {
        200: z.object({
          histories: sanitizedPassHistorySchema.array()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const histories = await server.services.authCredentialHistory.getCredentialHistory(req.params.userId);
      return { histories };
    }
  });

  server.route({
    method: "DELETE",
    url: "/credential-history/:id",
    config: { rateLimit: readLimit },
    schema: {
      params: z.object({ id: z.string().trim() }),
      response: {
        200: z.object({ id: z.string() })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const id = await server.services.authCredentialHistory.deleteCredentialHistory(req.params.id);
      return { id };
    }
  });
};
