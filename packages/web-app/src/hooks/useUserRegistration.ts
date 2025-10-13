'use client';

import { useEffect, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { useRouter } from 'next/navigation';
import {
  User,
  CreateUserRequest,
  UserResponse,
  formatAddress,
  validateEthAddress,
} from '@trustless/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SIGN_IN_MESSAGE = 'Sign in to Trustless SocialFi';

interface RegistrationState {
  isLoading: boolean;
  isRegistered: boolean;
  user: User | null;
  error: string | null;
  hasChecked: boolean; // 标记是否已检查过注册状态
}

export function useUserRegistration() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();

  const [state, setState] = useState<RegistrationState>({
    isLoading: false,
    isRegistered: false,
    user: null,
    error: null,
    hasChecked: false,
  });

  // Check if user is registered when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      checkRegistration(address);
    } else {
      setState({
        isLoading: false,
        isRegistered: false,
        user: null,
        error: null,
        hasChecked: false,
      });
    }
  }, [isConnected, address]);

  const checkRegistration = async (walletAddress: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`${API_URL}/users/${walletAddress}`);

      if (response.ok) {
        const user = await response.json();
        setState({
          isLoading: false,
          isRegistered: true,
          user,
          error: null,
          hasChecked: true,
        });
        return true;
      } else if (response.status === 404) {
        // User not registered
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isRegistered: false,
          hasChecked: true,
        }));
        return false;
      } else {
        throw new Error('Failed to check registration status');
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        hasChecked: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return false;
    }
  };

  const register = async (username?: string, bio?: string) => {
    if (!address) {
      setState((prev) => ({
        ...prev,
        error: 'No wallet connected',
      }));
      return;
    }

    // Validate address using shared utility
    if (!validateEthAddress(address)) {
      setState((prev) => ({
        ...prev,
        error: 'Invalid wallet address format',
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // 1. Request user signature
      let signature: string;
      try {
        signature = await signMessageAsync({
          message: SIGN_IN_MESSAGE,
        });
      } catch (signError) {
        console.error('Signature request error:', signError);
        throw new Error('用户拒绝签名或签名失败');
      }

      // Validate signature format
      if (!signature || signature === '0x' || signature.length < 132) {
        throw new Error('签名格式无效');
      }

      // 2. Call backend registration API with typed request
      const requestBody: CreateUserRequest = {
        walletAddress: address,
        signature,
        username: username || '',
        bio: bio || '',
      };

      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration API error:', errorData);
        throw new Error(errorData.details || errorData.error || 'Registration failed');
      }

      const data: UserResponse = await response.json();

      // Log formatted address using shared utility
      console.log(`User registered: ${formatAddress(address)}`);

      setState({
        isLoading: false,
        isRegistered: true,
        user: data.user,
        error: null,
        hasChecked: true,
      });

      // 3. Redirect to profile page
      router.push(`/profile/${address}`);
    } catch (error) {
      console.error('Registration error:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  return {
    ...state,
    register,
    checkRegistration: () => address && checkRegistration(address),
  };
}
