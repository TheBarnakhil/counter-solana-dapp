#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AZEnaNRnFrgtzorayRzCtWFEdRXwYdsnvAPKUS1oy9o2");

#[program]
pub mod counter_2 {
    use super::*;

  pub fn close(_ctx: Context<CloseCounter2>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.counter_2.count = ctx.accounts.counter_2.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.counter_2.count = ctx.accounts.counter_2.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeCounter2>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.counter_2.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeCounter2<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Counter2::INIT_SPACE,
  payer = payer
  )]
  pub counter_2: Account<'info, Counter2>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseCounter2<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub counter_2: Account<'info, Counter2>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub counter_2: Account<'info, Counter2>,
}

#[account]
#[derive(InitSpace)]
pub struct Counter2 {
  count: u8,
}
