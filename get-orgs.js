async function main() {
  const token = "AQUxt2xafTSHXbJgBbLMIM3Vy7j9t7mgtWnMa_4HTUgL9YcYhR-FG7YRLNcw-y4Jrhxbhf6Hv8LNRwNIMfgEfD6UkSKxCbyUr8dLk-VkODRLyWpVZ3hoFk87gn_ktG4UIJ_tKfkLSB3CughreqKuFL9LCh16OKDCFBVX7ALcV088YimkS6lU71i6-mi5Cx7vLfifLWgK4NurKL_citLyxGXxc30qppLeeZR9lEZPk2eNMcorlIJjh4da-tqZHuFyhhK7opRVNPbJ2FJXz0L7MkvCEtMk90eZpoYUll6rIZ8AJW8Pqm5lDmAzPst69hezZY4uoKZ5fIX1V1GEBlagVfuuq8H-FA";

  const endpoints = [
    'https://api.linkedin.com/v2/organizationAcls?q=roleAssignee',
    'https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee',
    'https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR'
  ];

  for (const url of endpoints) {
    try {
      console.log(`Querying ${url}...`);
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      console.log(`Status: ${res.status}`);
      const data = await res.json();
      console.log('Response:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(`Error querying ${url}:`, e);
    }
  }
}

main();
