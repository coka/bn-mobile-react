interface TransferActivity {
  accepted_by: User
  action: TransferActivityAction
  destination_addresses: string
  initiated_by: User
  occurred_at: string
  ticket_ids: Array<string>
  transfer_id: string
}

type TransferActivityAction = 'Accepted' | 'Cancelled' | 'Started'
