import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create 5 test users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        walletAddress: '0x1111111111111111111111111111111111111111',
        username: 'alice',
        bio: 'AI researcher and blockchain enthusiast',
      },
    }),
    prisma.user.create({
      data: {
        walletAddress: '0x2222222222222222222222222222222222222222',
        username: 'bob',
        bio: 'Full-stack developer building decentralized apps',
      },
    }),
    prisma.user.create({
      data: {
        walletAddress: '0x3333333333333333333333333333333333333333',
        username: 'charlie',
        bio: 'Content creator and Web3 advocate',
      },
    }),
    prisma.user.create({
      data: {
        walletAddress: '0x4444444444444444444444444444444444444444',
        username: 'diana',
        bio: 'Smart contract auditor and security expert',
      },
    }),
    prisma.user.create({
      data: {
        walletAddress: '0x5555555555555555555555555555555555555555',
        username: 'eve',
        bio: 'DeFi trader and protocol designer',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create some test posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        userId: users[0].id,
        content: 'Hello World! First post on Trustless SocialFi 🚀',
        status: 'approved',
      },
    }),
    prisma.post.create({
      data: {
        userId: users[1].id,
        content: 'Building the future of decentralized social media',
        status: 'approved',
      },
    }),
    prisma.post.create({
      data: {
        userId: users[2].id,
        content: 'Just deployed my first smart contract! #web3',
        status: 'pending',
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} posts`);

  // Create some follow relationships
  const follows = await Promise.all([
    prisma.follow.create({
      data: {
        followerId: users[0].id,
        followingId: users[1].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[0].id,
        followingId: users[2].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[1].id,
        followingId: users[0].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[2].id,
        followingId: users[0].id,
      },
    }),
  ]);

  console.log(`✅ Created ${follows.length} follow relationships`);

  // Create some likes
  const likes = await Promise.all([
    prisma.like.create({
      data: {
        userId: users[1].id,
        postId: posts[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: users[2].id,
        postId: posts[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: users[0].id,
        postId: posts[1].id,
      },
    }),
  ]);

  console.log(`✅ Created ${likes.length} likes`);

  // Create some comments
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        userId: users[1].id,
        postId: posts[0].id,
        content: 'Welcome to the platform!',
      },
    }),
    prisma.comment.create({
      data: {
        userId: users[2].id,
        postId: posts[0].id,
        content: 'Great to have you here!',
      },
    }),
  ]);

  console.log(`✅ Created ${comments.length} comments`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
