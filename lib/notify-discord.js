export async function notifyDiscord({ name, age, phone, times }) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '📩 새 상담신청이 도착했습니다!',
          color: 0x147d72,
          fields: [
            { name: '👤 이름', value: `**${name}** (${age}세)`, inline: true },
            { name: '📞 연락처', value: phone, inline: true },
            { name: '⏰ 선호 시간대', value: times.join(' · '), inline: false },
          ],
          timestamp: new Date().toISOString(),
        }],
      }),
    });
  } catch {
    // 알림 실패는 신청 처리에 영향 주지 않음
  }
}
