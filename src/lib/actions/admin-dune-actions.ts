'use server'

import { logger } from '@/lib/logger'
import {
  createDuneChart,
  updateDuneChart,
  deleteDuneChart,
  reorderDuneCharts,
} from '@/lib/dune-cache-service'
import type { CreateDuneChartInput, UpdateDuneChartInput } from '@/types/dune'

export async function saveDuneChartAsAdmin(
  input: CreateDuneChartInput | UpdateDuneChartInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    if ('id' in input && input.id) {
      await updateDuneChart(input as UpdateDuneChartInput)
    } else {
      await createDuneChart(input as CreateDuneChartInput)
    }
    return { success: true }
  } catch (err) {
    logger.error('saveDuneChartAsAdmin failed', err as Error)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function deleteDuneChartAsAdmin(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDuneChart(id)
    return { success: true }
  } catch (err) {
    logger.error('deleteDuneChartAsAdmin failed', err as Error)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function reorderDuneChartsAsAdmin(
  orderedIds: string[],
): Promise<{ success: boolean; error?: string }> {
  try {
    await reorderDuneCharts(orderedIds)
    return { success: true }
  } catch (err) {
    logger.error('reorderDuneChartsAsAdmin failed', err as Error)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
