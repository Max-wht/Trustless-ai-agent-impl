import { FastifyInstance } from 'fastify';
import { verifyMessage } from 'viem';
import { prisma } from '../lib/prisma';
import { registerUserOnChain, isUserRegisteredOnChain } from '../lib/web3';
import {
  User,
  CreateUserRequest,
  UserResponse,
  formatAddress,
  validateEthAddress,
} from '@trustless/shared';

const SIGN_IN_MESSAGE = 'Sign in to Trustless SocialFi';

export async function registerUserRoutes(app: FastifyInstance) {
  // Get all users
  app.get('/users', async () => {
    const users = await prisma.user.findMany();

    // Demo: Use shared utility function
    app.log.info(`Found ${users.length} users`);
    if (users.length > 0) {
      app.log.info(`First user: ${formatAddress(users[0].walletAddress)}`);
    }

    return users;
  });

  // Check if user is registered
  app.get<{
    Params: { address: string };
  }>('/users/:address', async (request, reply) => {
    const { address } = request.params;

    try {
      const user = await prisma.user.findUnique({
        where: { walletAddress: address.toLowerCase() },
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return user;
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Register new user
  app.post<{
    Body: CreateUserRequest;
  }>('/users/register', async (request, reply) => {
    const { walletAddress, signature, username = '', bio = '' } = request.body;

    // Validate input using shared utility
    if (!walletAddress || !signature) {
      return reply.status(400).send({
        error: 'Missing required fields: walletAddress, signature',
      });
    }

    if (!validateEthAddress(walletAddress)) {
      return reply.status(400).send({
        error: 'Invalid Ethereum address format',
      });
    }

    const normalizedAddress = walletAddress.toLowerCase();

    try {
      // 1. Check if user already exists in database
      const existingUser = await prisma.user.findUnique({
        where: { walletAddress: normalizedAddress },
      });

      if (existingUser) {
        return reply.status(409).send({
          error: 'User already registered',
          user: existingUser,
        });
      }

      // 2. Verify signature
      try {
        const isValidSignature = await verifyMessage({
          address: walletAddress as `0x${string}`,
          message: SIGN_IN_MESSAGE,
          signature: signature as `0x${string}`,
        });

        if (!isValidSignature) {
          app.log.error('Signature verification failed: invalid signature');
          return reply.status(401).send({
            error: 'Invalid signature',
          });
        }
      } catch (signError) {
        app.log.error('Signature verification error:');
        app.log.error(signError);
        return reply.status(400).send({
          error: 'Signature verification failed',
          details: signError instanceof Error ? signError.message : 'Invalid signature format',
        });
      }

      // 3. Check if user is registered on-chain
      const isOnChainRegistered = await isUserRegisteredOnChain(walletAddress as `0x${string}`);

      // 4. Register user on-chain if not already registered
      let txHash: string | undefined;
      if (!isOnChainRegistered) {
        try {
          txHash = await registerUserOnChain(walletAddress as `0x${string}`, username, bio);
          app.log.info(`User registered on-chain: ${txHash}`);
        } catch (chainError) {
          app.log.error('On-chain registration failed');
          app.log.error(chainError);
          return reply.status(500).send({
            error: 'Failed to register user on blockchain',
            details: chainError instanceof Error ? chainError.message : 'Unknown error',
          });
        }
      }

      // 5. Create user in database
      const user = await prisma.user.create({
        data: {
          walletAddress: normalizedAddress,
          username: username || null,
          bio: bio || null,
        },
      });

      // Return typed response
      const response: UserResponse = {
        success: true,
        user: user as User,
        txHash,
      };

      return reply.status(201).send(response);
    } catch (error) {
      app.log.error('Registration error');
      app.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Update user profile
  app.patch<{
    Params: { address: string };
    Body: { username?: string; bio?: string };
  }>('/users/:address', async (request, reply) => {
    const { address } = request.params;
    const { username, bio } = request.body;

    try {
      const user = await prisma.user.findUnique({
        where: { walletAddress: address.toLowerCase() },
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      const updatedUser = await prisma.user.update({
        where: { walletAddress: address.toLowerCase() },
        data: {
          username: username ?? user.username,
          bio: bio ?? user.bio,
        },
      });

      return updatedUser;
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
