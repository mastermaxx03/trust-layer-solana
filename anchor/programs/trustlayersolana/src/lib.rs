#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod trustlayersolana {
    use super::*;

  pub fn close(_ctx: Context<CloseTrustlayersolana>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.trustlayersolana.count = ctx.accounts.trustlayersolana.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.trustlayersolana.count = ctx.accounts.trustlayersolana.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeTrustlayersolana>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.trustlayersolana.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeTrustlayersolana<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Trustlayersolana::INIT_SPACE,
  payer = payer
  )]
  pub trustlayersolana: Account<'info, Trustlayersolana>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseTrustlayersolana<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub trustlayersolana: Account<'info, Trustlayersolana>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub trustlayersolana: Account<'info, Trustlayersolana>,
}

#[account]
#[derive(InitSpace)]
pub struct Trustlayersolana {
  count: u8,
}
