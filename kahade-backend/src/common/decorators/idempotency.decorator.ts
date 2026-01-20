import { SetMetadata } from '@nestjs/common';

export const IDEMPOTENCY_KEY = 'idempotency';

/**
 * Mark endpoint as idempotent
 * Requires X-Idempotency-Key header
 */
export const Idempotent = () => SetMetadata(IDEMPOTENCY_KEY, true);